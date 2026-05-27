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
// Codigo de erro do PostgreSQL para violacao de unicidade (unique_violation)
// Retornado pelo Supabase quando o indice unico uq_webhook_logs_source_event_sale
// rejeita um insert duplicado.
// ---------------------------------------------------------------------------
const PG_UNIQUE_VIOLATION = "23505"

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

  const { eventType, saleId, productName, amountCents, paymentMethod } =
    extractMinimalFields(body)

  // ---------------------------------------------------------------------------
  // Evento desconhecido sem sale_id: nao ha idempotencia possivel e nao ha
  // finalidade operacional. Registrar log tecnico minimo e retornar.
  // Tratado ANTES do INSERT principal para nao acumular registros "received"
  // sem identificador que nunca poderiam ser atualizados via .eq("sale_id").
  // ---------------------------------------------------------------------------
  if (!isKnownEvent(eventType) && !saleId) {
    await supabase.from("webhook_logs").insert({
      source: "kirvano",
      event_type: eventType || "unknown",
      sale_id: null,
      status: "unmapped_event",
      processed_at: new Date().toISOString(),
    })
    console.error(
      `[Kirvano Webhook] Evento desconhecido sem sale_id: "${eventType || "unknown"}". Registrado e ignorado.`
    )
    return NextResponse.json({ success: true, message: "Evento desconhecido sem sale_id registrado" })
  }

  // ---------------------------------------------------------------------------
  // Evento mapeado sem sale_id: nao ha idempotencia confiavel.
  // Registrar log tecnico minimo e retornar sem enviar Telegram.
  // ---------------------------------------------------------------------------
  if (isKnownEvent(eventType) && !saleId) {
    await supabase.from("webhook_logs").insert({
      source: "kirvano",
      event_type: eventType,
      sale_id: null,
      status: "missing_sale_id",
      processed_at: new Date().toISOString(),
    })
    console.error(`[Kirvano Webhook] Evento mapeado sem sale_id: "${eventType}". Ignorado.`)
    return NextResponse.json({ success: true, message: "Evento ignorado: sale_id ausente" })
  }

  // ---------------------------------------------------------------------------
  // Idempotencia via INSERT atomico.
  // O indice unico uq_webhook_logs_source_event_sale (source, event_type, sale_id)
  // garante que dois requests simultaneos do mesmo evento:
  //   - 1o request: insert bem-sucedido → continua para Telegram
  //   - 2o request: insert rejeita com unique_violation (23505) → retorna idempotente
  // Nao depender de SELECT anterior, pois ele nao evita condicao de corrida.
  // ---------------------------------------------------------------------------
  const logRecord = {
    source: "kirvano",
    event_type: eventType,
    sale_id: saleId || null,
    status: "received",
    processed_at: new Date().toISOString(),
  }

  const { error: logErr } = await supabase.from("webhook_logs").insert(logRecord)

  if (logErr) {
    // unique_violation: evento ja processado — retornar sucesso sem duplicar Telegram
    if (logErr.code === PG_UNIQUE_VIOLATION) {
      return NextResponse.json({ success: true, message: "Evento ja processado (idempotente)" })
    }
    // Outro erro de banco: nao enviar Telegram, retornar erro tecnico
    console.error("[Kirvano Webhook] Erro ao inserir log:", logErr.message)
    return NextResponse.json(
      { success: false, error: "Erro ao registrar evento" },
      { status: 500 }
    )
  }

  // ---------------------------------------------------------------------------
  // Processar por evento mapeado.
  // O insert acima foi bem-sucedido, entao este e o primeiro processamento.
  // ---------------------------------------------------------------------------
  try {
    if (!isKnownEvent(eventType)) {
      // Evento nao mapeado (com sale_id — sem sale_id foi tratado antes do INSERT):
      // apenas registra status tecnico, sem Telegram, sem PII.
      // saleId aqui e sempre uma string nao-vazia (garantido pelos guards acima).
      await supabase
        .from("webhook_logs")
        .update({ status: "unmapped_event" })
        .eq("source", "kirvano")
        .eq("event_type", eventType)
        .eq("sale_id", saleId)
        .eq("status", "received")

      console.error(
        `[Kirvano Webhook] Evento nao mapeado: "${eventType}". Adicionar ao mapa KIRVANO_EVENTS se confirmado.`
      )
      // Retorna imediatamente — nao executa o UPDATE para "processed" abaixo
      return NextResponse.json({ success: true, message: "Evento registrado como nao mapeado" })
    }

    // Evento mapeado: montar e enviar notificacao Telegram
    let telegramMsg: string

    switch (eventType) {
      case KIRVANO_EVENTS.SALE_APPROVED:
        telegramMsg = [
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
        break

      case KIRVANO_EVENTS.SALE_REFUNDED:
        telegramMsg = [
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
        break

      case KIRVANO_EVENTS.SALE_CHARGEBACK:
        telegramMsg = [
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
        break

      default:
        // TypeScript exhaustiveness — nunca deve chegar aqui
        telegramMsg = `<b>Evento:</b> ${eventType}`
    }

    await sendMessage(telegramMsg)

    // Marcar log como processado somente para eventos mapeados que chegaram ate aqui.
    // saleId e garantidamente nao-vazio neste ponto (guards acima).
    await supabase
      .from("webhook_logs")
      .update({ status: "processed" })
      .eq("source", "kirvano")
      .eq("event_type", eventType)
      .eq("sale_id", saleId)
      .eq("status", "received")

    return NextResponse.json({ success: true, message: "Webhook processado" })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    console.error("[Kirvano Webhook] Erro ao processar:", errorMessage)

    // Atualizar log com erro — sem expor dados da requisicao.
    // saleId e garantidamente nao-vazio neste ponto (guards acima).
    await supabase
      .from("webhook_logs")
      .update({ status: "error", error_message: errorMessage })
      .eq("source", "kirvano")
      .eq("event_type", eventType)
      .eq("sale_id", saleId)
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
