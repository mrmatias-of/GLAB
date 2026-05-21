/**
 * lib/telegram.ts
 * Cliente unificado para o bot do Telegram.
 * Expõe funções de envio, notificações tipadas e validação de admin.
 */

const TOKEN = process.env.TELEGRAM_BOT_TOKEN
const DEFAULT_CHAT = process.env.TELEGRAM_CHAT_ID

const BASE = () => `https://api.telegram.org/bot${TOKEN}`

// ─── Tipos internos ──────────────────────────────────────────────────────────

export interface InlineButton {
  text: string
  callback_data?: string
  url?: string
}

export interface SendOptions {
  chatId?: string | number
  parseMode?: 'HTML' | 'Markdown'
  buttons?: InlineButton[][]   // matriz de linhas de botões
  disablePreview?: boolean
}

// ─── Funções base ─────────────────────────────────────────────────────────────

export async function sendMessage(text: string, opts: SendOptions = {}): Promise<boolean> {
  if (!TOKEN) {
    console.error('[telegram] TELEGRAM_BOT_TOKEN não configurado')
    return false
  }

  const chatId = opts.chatId ?? DEFAULT_CHAT
  if (!chatId) {
    console.error('[telegram] Nenhum chat_id disponível')
    return false
  }

  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: opts.parseMode ?? 'HTML',
    disable_web_page_preview: opts.disablePreview ?? true,
  }

  if (opts.buttons?.length) {
    body.reply_markup = { inline_keyboard: opts.buttons.map(row =>
      row.map(btn => btn.url
        ? { text: btn.text, url: btn.url }
        : { text: btn.text, callback_data: btn.callback_data ?? btn.text }
      )
    )}
  }

  try {
    const res = await fetch(`${BASE()}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!data.ok) console.error('[telegram] API error:', data.description)
    return data.ok === true
  } catch (err) {
    console.error('[telegram] Falha ao enviar mensagem:', err)
    return false
  }
}

// Responde a uma mensagem específica (reply)
export async function replyMessage(chatId: number, text: string, opts: Omit<SendOptions, 'chatId'> = {}): Promise<boolean> {
  return sendMessage(text, { ...opts, chatId })
}

// ─── Notificações tipadas ────────────────────────────────────────────────────

export async function notifyVenda(data: {
  curso: string
  valor: string
  cliente: string
  email: string
  metodo?: string
  orderId?: string
}) {
  const texto = [
    '<b>Nova Venda Aprovada</b>',
    '',
    `<b>Curso:</b> ${data.curso}`,
    `<b>Valor:</b> ${data.valor}`,
    `<b>Cliente:</b> ${data.cliente}`,
    `<b>Email:</b> ${data.email}`,
    data.metodo ? `<b>Pagamento:</b> ${data.metodo}` : null,
    data.orderId ? `<b>Pedido:</b> <code>${data.orderId}</code>` : null,
    '',
    `<i>${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</i>`,
  ].filter(Boolean).join('\n')

  return sendMessage(texto, {
    buttons: [[
      { text: 'Ver Vendas',  url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://glabcursos.com.br'}/admin/vendas` },
    ]],
  })
}

export async function notifyCadastro(data: {
  email: string
  nome?: string
  via?: string
}) {
  const texto = [
    '<b>Novo Cadastro</b>',
    '',
    `<b>Email:</b> ${data.email}`,
    data.nome ? `<b>Nome:</b> ${data.nome}` : null,
    data.via  ? `<b>Via:</b> ${data.via}` : null,
    '',
    `<i>${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</i>`,
  ].filter(Boolean).join('\n')

  return sendMessage(texto)
}

export async function notifyContato(data: {
  nome: string
  email: string
  mensagem: string
}) {
  const texto = [
    '<b>Nova Mensagem de Contato</b>',
    '',
    `<b>Nome:</b> ${data.nome}`,
    `<b>Email:</b> ${data.email}`,
    '',
    `<b>Mensagem:</b>\n${data.mensagem}`,
    '',
    `<i>${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</i>`,
  ].join('\n')

  return sendMessage(texto, {
    buttons: [[
      { text: 'Ver Mensagens', url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://glabcursos.com.br'}/admin/mensagens` },
    ]],
  })
}

export async function notifyErro(data: {
  titulo: string
  mensagem: string
  stack?: string
  rota?: string
}) {
  const texto = [
    '<b>Erro no Sistema</b>',
    '',
    `<b>Titulo:</b> ${data.titulo}`,
    `<b>Mensagem:</b> ${data.mensagem}`,
    data.rota  ? `<b>Rota:</b> <code>${data.rota}</code>` : null,
    data.stack ? `\n<b>Stack:</b>\n<pre>${data.stack.slice(0, 600)}</pre>` : null,
    '',
    `<i>${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</i>`,
  ].filter(Boolean).join('\n')

  return sendMessage(texto)
}

export async function notifyReembolso(data: {
  curso: string
  cliente: string
  email: string
  valor: string
  orderId?: string
}) {
  const texto = [
    '<b>Reembolso Solicitado</b>',
    '',
    `<b>Curso:</b> ${data.curso}`,
    `<b>Cliente:</b> ${data.cliente}`,
    `<b>Email:</b> ${data.email}`,
    `<b>Valor:</b> ${data.valor}`,
    data.orderId ? `<b>Pedido:</b> <code>${data.orderId}</code>` : null,
    '',
    `<i>${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</i>`,
  ].filter(Boolean).join('\n')

  return sendMessage(texto)
}

// ─── Compatibilidade com código legado ───────────────────────────────────────
// As funções abaixo mantêm a assinatura anterior para não quebrar chamadas existentes

export async function sendTelegramNotification(payload: {
  title: string
  message: string
  details?: Record<string, unknown>
  type?: 'sale' | 'signup' | 'error' | 'contact'
}): Promise<boolean> {
  const lines = [
    `<b>${payload.title}</b>`,
    '',
    payload.message,
    payload.details
      ? '\n' + Object.entries(payload.details)
          .map(([k, v]) => `<b>${k}:</b> ${String(v)}`)
          .join('\n')
      : null,
    '',
    `<i>${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</i>`,
  ].filter(Boolean).join('\n')

  return sendMessage(lines)
}

export const notifySale    = (c: string, v: string, n?: string) => notifyVenda({ curso: c, valor: v, cliente: n ?? 'Desconhecido', email: '' })
export const notifySignup  = (email: string, nome?: string)     => notifyCadastro({ email, nome })
export const notifyError   = (t: string, m: string, s?: string) => notifyErro({ titulo: t, mensagem: m, stack: s })
export const notifyContact = (n: string, e: string, msg: string) => notifyContato({ nome: n, email: e, mensagem: msg })
