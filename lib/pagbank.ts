import crypto from 'node:crypto'

const PAGBANK_API = process.env.PAGBANK_ENV === 'production'
  ? 'https://api.pagseguro.com'
  : 'https://sandbox.api.pagseguro.com'

function token() {
  const value = process.env.PAGBANK_TOKEN
  if (!value) throw new Error('PAGBANK_TOKEN não configurado.')
  return value
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
    console.error('[v0] PagBank API error', { status: response.status, path, body })
    throw new Error('Não foi possível processar o pagamento no PagBank.')
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

export async function getPagBankPublicKey() {
  const response = await pagbankFetch<{ public_key: string }>('/public-keys/card')
  return response.public_key
}

export async function createPagBankCardOrder(input: {
  referenceId: string
  amountCents: number
  description: string
  customer: { name: string; email: string; taxId?: string; phones?: Array<{ country: string; area: string; number: string; type: string }> }
  encryptedCard: string
  installments?: number
}) {
  return pagbankFetch<PagBankOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify({
      reference_id: input.referenceId,
      customer: {
        name: input.customer.name,
        email: input.customer.email,
        tax_id: input.customer.taxId,
        phones: input.customer.phones,
      },
      items: [{ reference_id: input.referenceId, name: input.description, quantity: 1, unit_amount: input.amountCents }],
      charges: [{
        reference_id: input.referenceId,
        description: input.description,
        amount: { value: input.amountCents, currency: 'BRL' },
        payment_method: {
          type: 'CREDIT_CARD',
          installments: input.installments ?? 1,
          capture: true,
          card: { encrypted: input.encryptedCard, store: false },
        },
      }],
    }),
  })
}

export async function createPagBankPixOrder(input: {
  referenceId: string
  amountCents: number
  description: string
  customer: { name: string; email: string; taxId: string }
}) {
  return pagbankFetch<PagBankOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify({
      reference_id: input.referenceId,
      customer: input.customer,
      items: [{ reference_id: input.referenceId, name: input.description, quantity: 1, unit_amount: input.amountCents }],
      qr_codes: [{ amount: { value: input.amountCents }, expiration_date: new Date(Date.now() + 30 * 60_000).toISOString() }],
    }),
  })
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
