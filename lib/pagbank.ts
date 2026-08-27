import crypto from 'node:crypto'

const PAGBANK_API = process.env.PAGBANK_ENV === 'production'
  ? 'https://api.pagseguro.com'
  : 'https://sandbox.api.pagseguro.com'

function token() {
  const value = process.env.PAGBANK_TOKEN
  if (!value) throw new Error('PAGBANK_TOKEN não configurado.')
  return value
}

function appBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'https://www.glabcursos.com.br').replace(/\/$/, '')
}

function pagbankNotificationUrl() {
  return `${appBaseUrl()}/api/pagbank/webhook`
}

export class PagBankError extends Error {
  status: number
  details: Array<{ code?: string; description?: string; parameter_name?: string }>
  constructor(message: string, status: number, details: PagBankError['details']) {
    super(message)
    this.name = 'PagBankError'
    this.status = status
    this.details = details
  }
}

const FIELD_LABELS: Record<string, string> = {
  'charges[0].payment_method.card.encrypted': 'dados do cartão',
  'charges[0].payment_method.card.exp_month': 'mês de validade',
  'charges[0].payment_method.card.exp_year': 'ano de validade',
  'charges[0].payment_method.card.security_code': 'código de segurança (CVV)',
  'charges[0].payment_method.card.number': 'número do cartão',
  'charges[0].payment_method.card.holder.name': 'nome impresso no cartão',
  'charges[0].payment_method.installments': 'número de parcelas',
  'customer.tax_id': 'CPF',
  'customer.email': 'e-mail',
  'customer.name': 'nome',
}

function humanizePagBankError(status: number, details: PagBankError['details']) {
  if (status === 401 || status === 403) {
    return 'A integração com o PagBank está com credenciais inválidas. Verifique o token configurado.'
  }
  const first = details[0]
  if (first) {
    const label = first.parameter_name ? FIELD_LABELS[first.parameter_name] : undefined
    if (label) return `Confira o campo ${label} e tente novamente.`
    if (first.description) return `PagBank recusou o pagamento: ${first.description}`
  }
  if (status >= 500) return 'O PagBank está temporariamente indisponível. Tente novamente em alguns instantes.'
  return 'Não foi possível processar o pagamento no PagBank.'
}

async function pagbankFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${PAGBANK_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })
  const text = await response.text()
  let body: unknown = null
  try { body = text ? JSON.parse(text) : null } catch { body = text }
  if (!response.ok) {
    const details = (body as { error_messages?: PagBankError['details'] } | null)?.error_messages ?? []
    console.error('Erro na API do PagBank', {
      status: response.status,
      environment: process.env.PAGBANK_ENV ?? 'sandbox',
      path,
      details,
      body: details.length ? undefined : body,
    })
    throw new PagBankError(humanizePagBankError(response.status, details), response.status, details)
  }
  return body as T
}

export type PagBankCharge = {
  id: string
  status: string
  payment_method?: { type?: string; installments?: number }
  amount?: { value: number; currency: string }
}

export type PagBankOrder = {
  id: string
  reference_id?: string
  charges?: PagBankCharge[]
  qr_codes?: Array<{ id: string; amount: { value: number }; text: string; links?: Array<{ rel: string; href: string; media: string }> }>
  links?: Array<{ rel: string; href: string; media: string }>
}

export type PagBankHostedCheckout = {
  id: string
  reference_id?: string
  links?: Array<{ rel?: string; href?: string; media?: string; type?: string }>
  checkout_url?: string
  payment_url?: string
  orders?: Array<{ id: string }>
}

/**
 * Escolhe a URL para onde o aluno deve ser levado.
 *
 * O PagBank devolve vários links e o primeiro é sempre o SELF, que aponta
 * para o próprio endpoint da API e exige o header Authorization. Redirecionar
 * o navegador para ele resulta em "invalid_authorization_header", porque o
 * token existe só no servidor. Por isso aceitamos apenas o link PAY e nunca
 * caímos em um endereço do host da API.
 */
function resolvePayUrl(checkout: PagBankHostedCheckout) {
  const isApiEndpoint = (href: string) => {
    try {
      return new URL(href).hostname.endsWith('api.pagseguro.com')
    } catch {
      return true
    }
  }

  const candidates = [
    checkout.links?.find(link => link.rel?.toUpperCase() === 'PAY')?.href,
    checkout.checkout_url,
    checkout.payment_url,
    ...(checkout.links ?? [])
      .filter(link => link.rel?.toUpperCase() !== 'SELF' && link.rel?.toUpperCase() !== 'INACTIVATE')
      .map(link => link.href),
  ]

  return candidates.find((href): href is string => Boolean(href) && !isApiEndpoint(href!))
}

export async function createPagBankHostedCheckout(input: {
  referenceId: string
  amountCents: number
  description: string
  customer: { name: string; email: string }
  orderId?: string
}) {
  const checkout = await pagbankFetch<PagBankHostedCheckout>('/checkouts', {
    method: 'POST',
    body: JSON.stringify({
      reference_id: input.referenceId,
      customer_modifiable: true,
      customer: {
        name: input.customer.name,
        email: input.customer.email,
      },
      items: [{
        reference_id: input.referenceId,
        name: input.description,
        quantity: 1,
        unit_amount: input.amountCents,
      }],
      payment_methods: [
        { type: 'CREDIT_CARD' },
        { type: 'PIX' },
        { type: 'BOLETO' },
      ],
      payment_methods_configs: [
        { type: 'CREDIT_CARD', config_options: [{ option: 'INSTALLMENTS_LIMIT', value: '12' }] },
      ],
      soft_descriptor: 'GLABCURSOS',
      redirect_url: `${appBaseUrl()}/aluno?pagbank=retorno${input.orderId ? `&orderId=${encodeURIComponent(input.orderId)}` : ''}`,
      return_url: `${appBaseUrl()}/aluno?pagbank=retorno${input.orderId ? `&orderId=${encodeURIComponent(input.orderId)}` : ''}`,
      redirect_waiting_time: 10,
      notification_urls: [pagbankNotificationUrl()],
      payment_notification_urls: [pagbankNotificationUrl()],
    }),
  })

  const checkoutUrl = resolvePayUrl(checkout)
  if (!checkoutUrl) throw new Error('PagBank criou o checkout, mas não retornou o link de pagamento.')
  return { checkoutId: checkout.id, checkoutUrl, pagbankOrderId: checkout.orders?.[0]?.id ?? null }
}

export async function getPagBankOrder(orderId: string) {
  return pagbankFetch<PagBankOrder>(`/orders/${encodeURIComponent(orderId)}`)
}

export function verifyPagBankWebhook(rawBody: string, signature: string | null) {
  const secret = process.env.PAGBANK_WEBHOOK_SECRET
  if (!secret || !signature) return false
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  const supplied = signature.replace(/^sha256=/, '')
  return supplied.length === expected.length && crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))
}

export function isPagBankProduction() {
  return process.env.PAGBANK_ENV === 'production'
}

export function pagBankApiBaseUrl() {
  return PAGBANK_API
}
