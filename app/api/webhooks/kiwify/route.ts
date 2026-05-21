import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { notifyVenda, notifyCadastro, notifyReembolso } from "@/lib/telegram"

// Cliente Supabase com service role para operações admin
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Validar assinatura do webhook Kiwify
function validateKiwifySignature(payload: string, signature: string | null): boolean {
  const secret = process.env.KIWIFY_WEBHOOK_SECRET
  if (!secret || !signature) return false
  
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

// Tipos do webhook Kiwify
type KiwifyWebhookPayload = {
  order_id: string
  order_status: "paid" | "refunded" | "cancelled" | "waiting_payment" | "expired"
  product: {
    product_id: string
    product_name: string
  }
  Customer: {
    email: string
    full_name: string
    mobile?: string
  }
  Commissions: {
    charge_amount: number
    product_base_price: number
  }
  payment_method?: string
  created_at: string
  approved_date?: string
}

export async function POST(request: NextRequest) {
  const supabase = getServiceClient()
  
  // Ler payload
  const rawBody = await request.text()
  let payload: KiwifyWebhookPayload
  
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  // Log do webhook recebido
  await supabase.from("webhook_logs").insert({
    source: "kiwify",
    event_type: payload.order_status,
    payload: payload as unknown as Record<string, unknown>,
    status: "received"
  })

  // Validar assinatura (em produção)
  const signature = request.headers.get("x-kiwify-signature")
  if (process.env.NODE_ENV === "production" && process.env.KIWIFY_WEBHOOK_SECRET) {
    if (!validateKiwifySignature(rawBody, signature)) {
      await supabase.from("webhook_logs").update({ 
        status: "failed",
        error_message: "Invalid signature"
      }).eq("payload->order_id", payload.order_id)
      
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }
  }

  try {
    const { order_id, order_status, product, Customer, Commissions, payment_method, approved_date } = payload
    
    // Buscar curso pelo kiwify_product_id
    const { data: curso } = await supabase
      .from("cursos")
      .select("id, titulo")
      .eq("kiwify_product_id", product.product_id)
      .single()

    if (!curso) {
      await supabase.from("webhook_logs").update({ 
        status: "ignored",
        error_message: `Produto ${product.product_id} não encontrado`
      }).eq("payload->order_id", order_id)
      
      return NextResponse.json({ 
        success: true, 
        message: "Produto não mapeado, webhook ignorado" 
      })
    }

    // Buscar ou criar usuário pelo email
    let userId: string

    // Verificar se usuário já existe
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const user = existingUser?.users?.find(u => u.email === Customer.email)

    if (user) {
      userId = user.id
    } else {
      // Criar novo usuário
      const tempPassword = crypto.randomBytes(16).toString("hex")
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: Customer.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          nome: Customer.full_name,
          telefone: Customer.mobile,
          created_via: "kiwify"
        }
      })

      if (createError || !newUser.user) {
        throw new Error(`Erro ao criar usuário: ${createError?.message}`)
      }

      userId = newUser.user.id

      // Criar notificação de boas-vindas
      await supabase.from("notifications").insert({
        user_id: userId,
        title: "Bem-vindo ao G•Lab Cursos!",
        message: `Seu acesso ao curso "${curso.titulo}" foi liberado. Defina sua senha para acessar.`,
        type: "success",
        link: "/minha-conta"
      })
    }

    // Mapear status
    const statusMap: Record<string, string> = {
      paid: "approved",
      refunded: "refunded",
      cancelled: "cancelled",
      waiting_payment: "pending",
      expired: "cancelled"
    }

    const purchaseStatus = statusMap[order_status] || "pending"

    // Upsert da compra
    const purchaseData = {
      user_id: userId,
      curso_id: curso.id,
      kiwify_order_id: order_id,
      kiwify_product_id: product.product_id,
      status: purchaseStatus,
      valor: Commissions.charge_amount / 100, // Kiwify envia em centavos
      metodo_pagamento: payment_method,
      email_comprador: Customer.email,
      approved_at: purchaseStatus === "approved" && approved_date ? new Date(approved_date).toISOString() : null
    }

    const { error: purchaseError } = await supabase
      .from("purchases")
      .upsert(purchaseData, { onConflict: "kiwify_order_id" })

    if (purchaseError) {
      throw new Error(`Erro ao salvar compra: ${purchaseError.message}`)
    }

    // Se aprovado, criar notificação e avisar no Telegram
    if (purchaseStatus === "approved") {
      await supabase.from("notifications").insert({
        user_id: userId,
        title: "Compra aprovada!",
        message: `Seu acesso ao curso "${curso.titulo}" foi liberado. Bons estudos!`,
        type: "success",
        link: `/aluno/cursos/${curso.id}`
      })

      // Notificar admin via Telegram
      await notifyVenda({
        curso:    curso.titulo,
        valor:    `R$ ${(Commissions.charge_amount / 100).toFixed(2).replace('.', ',')}`,
        cliente:  Customer.full_name,
        email:    Customer.email,
        metodo:   payment_method,
        orderId:  order_id,
      })

      // Notificar cadastro se usuário foi criado agora
      if (!user) {
        await notifyCadastro({ email: Customer.email, nome: Customer.full_name, via: 'kiwify' })
      }
    }

    if (purchaseStatus === "refunded") {
      await notifyReembolso({
        curso:    curso.titulo,
        cliente:  Customer.full_name,
        email:    Customer.email,
        valor:    `R$ ${(Commissions.charge_amount / 100).toFixed(2).replace('.', ',')}`,
        orderId:  order_id,
      })
    }

    // Atualizar log
    await supabase.from("webhook_logs").update({ 
      status: "processed",
      processed_at: new Date().toISOString()
    }).eq("payload->order_id", order_id)

    return NextResponse.json({ 
      success: true, 
      message: `Compra ${purchaseStatus}`,
      user_id: userId,
      curso_id: curso.id
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    
    await supabase.from("webhook_logs").update({ 
      status: "failed",
      error_message: errorMessage
    }).eq("payload->order_id", payload.order_id)

    console.error("[Kiwify Webhook Error]", errorMessage)
    
    return NextResponse.json({ 
      error: "Erro ao processar webhook",
      details: errorMessage
    }, { status: 500 })
  }
}

// GET para verificar se webhook está ativo
export async function GET() {
  return NextResponse.json({ 
    status: "active",
    endpoint: "/api/webhooks/kiwify",
    events: ["paid", "refunded", "cancelled", "waiting_payment", "expired"]
  })
}
