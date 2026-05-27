import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendMessage } from "@/lib/telegram"

// ---------------------------------------------------------------------------
// Eventos Kirvano confirmados pela documentacao oficial
// Ref: https://help.kirvano.com/hc/central-de-ajuda/articles/1765385505
// ---------------------------------------------------------------------------
const KIRVANO_EVENTS = {
  SALE_APPROVED: "SALE_APPROVED",
  SALE_REFUNDED: "SALE_REFUNDED",
  SALE_CHARGEBACK: "SALE_CHARGEBACK",
} as const

type KirvanoEvent = (typeof KIRVANO_EVENTS)[keyof typeof KIRVANO_EVENTS]

function isKnownEvent(eventType: string): eventType is KirvanoEvent {
  return Object.values(KIRVANO_EVENTS).includes(eventType as KirvanoEvent)
}

// ---------------------------------------------------------------------------
// Validacao de token — INATIVA ate confirmacao do formato real da Kirvano.
// O campo "Token" da Kirvano nao especifica publicamente o nome do header
// nem o formato (Bearer, direto, HMAC).
// Manter funcao preparada; ativar somente apos confirmacao nos logs da Kirvano.
// ---------------------------------------------------------------------------
function validateKirvanoToken(request: NextRequest): boolean {
  const token = process.env.KIRVANO_WEBHOOK_TOKEN
  if (!token) {
    // Permissivo enquanto token nao estiver configurado — nao bloqueia eventos reais
    return true
  }

  const authHeader = request.headers.get("authorization") ?? ""
  const received = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader

  if (received.length !== token.length) return false

  // Comparacao timing-safe
  let diff = 0
  for (let i = 0; i < token.length; i++) {
    diff |= received.charCodeAt(i) ^ token.charCodeAt(i)
  }
  return diff === 0
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ---------------------------------------------------------------------------
// Extrair somente os campos necessarios do payload Kirvano.
// Nenhum dado pessoal (nome, email, CPF, telefone, dados de pagamento)
// e armazenado no banco ou enviado ao Telegram.
// ---------------------------------------------------------------------------
function extractMinimalFields(body: Record<string, unknown>) {
  const sale = (body.sale ?? body.data ?? {}) as Record<string, unknown>
  const products = (body.products ?? sale.products ?? []) as Array<Record<string, unknown>>

  const eventType = (body.event ?? body.type ?? body.event_type ?? "") as string
  const saleId = (
    body.sale_id ??
    sale.sale_id ??
    body.order_id ??
    sale.order_id ??
    body.id ??
    ""
  ) as string

  const firstProduct = products[0] ?? {}
  const productName = (
    firstProduct.name ?? firstProduct.offer_name ?? body.product_name ?? ""
  ) as string
  const productId = (firstProduct.id ?? firstProduct.product_id ?? "") as string

  const rawAmount =
    (sale.total_price ?? sale.amount ?? body.total_price ?? body.amount ?? 0) as number | string
  const amountCents =
    typeof rawAmount === "number" ? rawAmount : parseFloat(String(rawAmount)) || 0

  const paymentMethod = (
    sale.payment_method ??
    body.payment_method ??
    ""
  ) as string

  const status = (sale.status ?? body.status ?? "") as string

  return { eventType, saleId, productName, productId, amountCents, paymentMethod, status }
}

function formatCurrency(amountCents: number): string {
  // Kirvano envia valores em centavos
  return `R$ ${(amountCents / 100).toFixed(2).replace(".", ",")}`
}

// ---------------------------------------------------------------------------
// POST — processar eventos Kirvano
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const supabase = getSupabase()

  // Validar token (permissivo enquanto KIRVANO_WEBHOOK_TOKEN nao estiver definida)
  if (!validateKirvanoToken(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 })
  }

  const { eventType, saleId, productName, productId, amountCents, paymentMethod, status } =
    extractMinimalFields(body)

  // ---------------------------------------------------------------------------
  // Idempotencia: ignorar reenvios do mesmo evento para o mesmo sale_id
  // ---------------------------------------------------------------------------
  if (saleId) {
    const { data: existing } = await supabase
      .from("webhook_logs")
      .select("id")
      .eq("source", "kirvano")
      .eq("event_type", eventType)
      .eq("sale_id", saleId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, message: "Evento ja processado (idempotente)" })
    }
  }

  // ---------------------------------------------------------------------------
  // Registrar log minimo ANTES de processar — sem payload bruto, sem PII
  // ---------------------------------------------------------------------------
  const logRecord: Record<string, unknown> = {
    source: "kirvano",
    event_type: eventType,
    sale_id: saleId || null,
    status: "received",
    processed_at: new Date().toISOString(),
  }

  const { error: logErr } = await supabase.from("webhook_logs").insert(logRecord)
  if (logErr) {
    console.error("[Kirvano Webhook] Erro ao inserir log:", logErr.message)
  }

  // ---------------------------------------------------------------------------
  // Processar por evento mapeado
  // ---------------------------------------------------------------------------
  try {
    if (isKnownEvent(eventType)) {
      switch (eventType) {
        case KIRVANO_EVENTS.SALE_APPROVED: {
          const msg = [
            "<b>VENDA APROVADA</b>",
            "",
            `<b>Produto:</b> ${productName || "N/A"}`,
            `<b>Valor:</b> ${formatCurrency(amountCents)}`,
            `<b>Pagamento:</b> ${paymentMethod || "N/A"}`,
            saleId ? `<b>ID da venda:</b> <code>${saleId}</code>` : "",
            "",
            "<i>Via Kirvano</i>",
          ]
            .filter(Boolean)
            .join("\n")

          await sendMessage(msg)

          // Registrar no banco somente campos operacionais minimos
          // Colunas existentes no schema real: kiwify_order_id, kiwify_product_id,
          // status, valor, metodo_pagamento, email_comprador, approved_at
          // user_id e curso_id sao NOT NULL no schema original — usamos valores
          // placeholder neutros ate que o schema seja migrado para Kirvano.
          // Por ora, gravamos apenas em webhook_logs (ja feito acima) e nao em
          // purchases, pois o schema exige user_id e curso_id que nao existem
          // no contexto do webhook externo. Ver nota de migracao no PR.
          break
        }

        case KIRVANO_EVENTS.SALE_REFUNDED: {
          const msg = [
            "<b>REEMBOLSO</b>",
            "",
            `<b>Produto:</b> ${productName || "N/A"}`,
            `<b>Valor:</b> ${formatCurrency(amountCents)}`,
            saleId ? `<b>ID da venda:</b> <code>${saleId}</code>` : "",
            "",
            "<i>Via Kirvano</i>",
          ]
            .filter(Boolean)
            .join("\n")

          await sendMessage(msg)
          break
        }

        case KIRVANO_EVENTS.SALE_CHARGEBACK: {
          const msg = [
            "<b>CHARGEBACK</b>",
            "",
            `<b>Produto:</b> ${productName || "N/A"}`,
            `<b>Valor:</b> ${formatCurrency(amountCents)}`,
            saleId ? `<b>ID da venda:</b> <code>${saleId}</code>` : "",
            "",
            "<i>Via Kirvano</i>",
          ]
            .filter(Boolean)
            .join("\n")

          await sendMessage(msg)
          break
        }
      }
    } else {
      // Evento nao mapeado — registra apenas info tecnica minima, sem PII, sem Telegram pessoal
      await supabase
        .from("webhook_logs")
        .update({ status: "unmapped_event" })
        .eq("source", "kirvano")
        .eq("event_type", eventType)
        .eq("sale_id", saleId || null)
        .eq("status", "received")

      console.error(
        `[Kirvano Webhook] Evento nao mapeado recebido: "${eventType}". Adicionar ao mapa KIRVANO_EVENTS se confirmado.`
      )
    }

    // Marcar log como processado
    await supabase
      .from("webhook_logs")
      .update({ status: "processed" })
      .eq("source", "kirvano")
      .eq("event_type", eventType)
      .eq("sale_id", saleId || null)
      .eq("status", "received")

    return NextResponse.json({ success: true, message: "Webhook processado" })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    console.error("[Kirvano Webhook] Erro ao processar:", errorMessage)

    // Atualizar log com erro — sem expor dados da requisicao
    await supabase
      .from("webhook_logs")
      .update({ status: "error", error_message: errorMessage })
      .eq("source", "kirvano")
      .eq("event_type", eventType)
      .eq("sale_id", saleId || null)
      .eq("status", "received")

    return NextResponse.json(
      { success: false, error: "Erro ao processar webhook" },
      { status: 500 }
    )
  }
}

// GET — verificar se endpoint esta ativo (sem expor detalhes internos)
export async function GET() {
  return NextResponse.json({ status: "ok" })
}
