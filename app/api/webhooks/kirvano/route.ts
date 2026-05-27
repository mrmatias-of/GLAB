import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendMessage } from "@/lib/telegram"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Valida o token de autenticação do webhook da Kirvano.
 * Só rejeita quando KIRVANO_WEBHOOK_TOKEN estiver configurada —
 * enquanto a variável não existir, todos os eventos passam (modo permissivo).
 * Isso garante que nenhuma venda em produção seja interrompida antes que
 * o token seja configurado nas duas pontas (Kirvano + Vercel).
 *
 * Formato esperado do header: Authorization: Bearer <token>
 * (Confirmar no painel da Kirvano antes de ativar.)
 */
function validateKirvanoToken(request: NextRequest): boolean {
  const expectedToken = process.env.KIRVANO_WEBHOOK_TOKEN
  if (!expectedToken) {
    // Variável não configurada → modo permissivo (não rejeita)
    return true
  }
  const authHeader = request.headers.get("authorization") ?? ""
  const receivedToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim()
  // Comparação com timing constante para evitar timing attacks
  if (receivedToken.length !== expectedToken.length) return false
  let equal = 0
  for (let i = 0; i < expectedToken.length; i++) {
    equal |= receivedToken.charCodeAt(i) ^ expectedToken.charCodeAt(i)
  }
  return equal === 0
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase()

  // Validação de autenticidade — só bloqueia se KIRVANO_WEBHOOK_TOKEN estiver definida
  if (!validateKirvanoToken(request)) {
    console.error("[Kirvano Webhook] Token inválido — requisição rejeitada")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Log do webhook recebido
    await supabase.from("webhook_logs").insert({
      provider: "kirvano",
      event: body.event || body.type || "unknown",
      payload: body,
      status: "received"
    })

    // Extrair dados do payload Kirvano
    const {
      event,
      type,
      data,
      customer,
      product,
      transaction,
      order,
      sale,
    } = body

    // Determinar tipo de evento
    const eventType = event || type || ""
    
    // Dados do cliente
    const clienteNome = customer?.name || data?.customer?.name || data?.buyer?.name || "Cliente"
    const clienteEmail = customer?.email || data?.customer?.email || data?.buyer?.email || ""
    const clienteTelefone = customer?.phone || data?.customer?.phone || data?.buyer?.phone || ""
    
    // Dados do produto
    const produtoNome = product?.name || data?.product?.name || data?.offer?.name || "Produto"
    const produtoId = product?.id || data?.product?.id || ""
    
    // Dados da transacao
    const valor = transaction?.amount || data?.amount || data?.value || sale?.amount || order?.amount || 0
    const valorFormatado = typeof valor === "number" 
      ? `R$ ${(valor / 100).toFixed(2).replace(".", ",")}`
      : `R$ ${valor}`
    const metodoPagamento = transaction?.payment_method || data?.payment_method || "N/A"
    const transactionId = transaction?.id || data?.transaction_id || order?.id || ""
    const status = transaction?.status || data?.status || sale?.status || ""

    // Processar eventos
    if (eventType.includes("approved") || eventType.includes("paid") || eventType.includes("confirmed") || status === "approved" || status === "paid") {
      // Venda aprovada
      const mensagem = [
        "<b>💰 NOVA VENDA APROVADA!</b>",
        "",
        `<b>Produto:</b> ${produtoNome}`,
        `<b>Valor:</b> ${valorFormatado}`,
        "",
        `<b>Cliente:</b> ${clienteNome}`,
        `<b>Email:</b> ${clienteEmail}`,
        clienteTelefone ? `<b>Telefone:</b> ${clienteTelefone}` : "",
        "",
        `<b>Pagamento:</b> ${metodoPagamento}`,
        transactionId ? `<b>ID:</b> <code>${transactionId}</code>` : "",
        "",
        `<i>Via Kirvano</i>`,
      ].filter(Boolean).join("\n")

      await sendMessage(mensagem)

      // Registrar venda no banco
      await supabase.from("purchases").insert({
        customer_email: clienteEmail,
        customer_name: clienteNome,
        product_name: produtoNome,
        product_id: produtoId,
        amount: typeof valor === "number" ? valor : parseFloat(valor) || 0,
        status: "approved",
        provider: "kirvano",
        transaction_id: transactionId,
        payment_method: metodoPagamento,
        raw_data: body,
      }).select().single()

    } else if (eventType.includes("refund") || status === "refunded") {
      // Reembolso
      const mensagem = [
        "<b>⚠️ REEMBOLSO SOLICITADO</b>",
        "",
        `<b>Produto:</b> ${produtoNome}`,
        `<b>Valor:</b> ${valorFormatado}`,
        `<b>Cliente:</b> ${clienteNome}`,
        `<b>Email:</b> ${clienteEmail}`,
        "",
        `<i>Via Kirvano</i>`,
      ].join("\n")

      await sendMessage(mensagem)

    } else if (eventType.includes("pending") || eventType.includes("waiting") || status === "pending") {
      // Pagamento pendente (boleto, pix)
      const mensagem = [
        "<b>⏳ PAGAMENTO PENDENTE</b>",
        "",
        `<b>Produto:</b> ${produtoNome}`,
        `<b>Valor:</b> ${valorFormatado}`,
        `<b>Cliente:</b> ${clienteNome}`,
        `<b>Metodo:</b> ${metodoPagamento}`,
        "",
        `<i>Aguardando confirmacao</i>`,
      ].join("\n")

      await sendMessage(mensagem)

    } else if (eventType.includes("abandoned") || eventType.includes("cart")) {
      // Carrinho abandonado
      const mensagem = [
        "<b>🛒 CARRINHO ABANDONADO</b>",
        "",
        `<b>Produto:</b> ${produtoNome}`,
        `<b>Cliente:</b> ${clienteNome}`,
        `<b>Email:</b> ${clienteEmail}`,
        clienteTelefone ? `<b>Telefone:</b> ${clienteTelefone}` : "",
      ].filter(Boolean).join("\n")

      await sendMessage(mensagem)

    } else {
      // Evento desconhecido - notificar mesmo assim
      const mensagem = [
        `<b>📩 Webhook Kirvano: ${eventType || "evento"}</b>`,
        "",
        `<b>Produto:</b> ${produtoNome}`,
        `<b>Cliente:</b> ${clienteNome}`,
        `<b>Status:</b> ${status || "N/A"}`,
      ].join("\n")

      await sendMessage(mensagem)
    }

    // Atualizar log como processado
    await supabase.from("webhook_logs")
      .update({ status: "processed" })
      .eq("provider", "kirvano")
      .eq("payload", body)

    return NextResponse.json({ success: true, message: "Webhook processado" })

  } catch (error) {
    console.error("[Kirvano Webhook] Erro:", error)
    
    // Notificar erro no Telegram
    await sendMessage(`<b>❌ Erro no webhook Kirvano</b>\n\n<code>${error instanceof Error ? error.message : "Erro desconhecido"}</code>`)

    return NextResponse.json(
      { success: false, error: "Erro ao processar webhook" },
      { status: 500 }
    )
  }
}

// GET para verificar se o endpoint esta ativo
export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "Webhook Kirvano ativo",
    endpoint: "/api/webhooks/kirvano"
  })
}
