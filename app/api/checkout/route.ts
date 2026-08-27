import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createPagBankCardOrder, createPagBankPixOrder } from '@/lib/pagbank'
import { createPendingOrder, fulfillPaidOrder } from '@/lib/learning-platform'
import { pool } from '@/lib/db'

function isValidCpf(value: string) {
  if (!/^\d{11}$/.test(value) || /^(\d)\1{10}$/.test(value)) return false
  const digits = value.split('').map(Number)
  for (const [length, position] of [[9, 10], [10, 11]] as const) {
    let sum = 0
    for (let index = 0; index < length; index += 1) sum += digits[index] * (position - index)
    const remainder = (sum * 10) % 11
    if ((remainder === 10 ? 0 : remainder) !== digits[length]) return false
  }
  return true
}

const schema = z.object({
  productSlug: z.string().min(1).max(120),
  buyerName: z.string().min(3).max(160),
  buyerEmail: z.string().email().max(254),
  taxId: z
    .string()
    .transform((value) => value.replace(/\D/g, ''))
    .refine(isValidCpf, 'Informe um CPF válido com 11 dígitos.'),
  method: z.enum(['CARD', 'PIX']),
  encryptedCard: z.string().min(20).max(10000).optional(),
  installments: z.number().int().min(1).max(12).optional(),
  couponCode: z.string().max(40).optional(),
})

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json())
    if (input.method === 'CARD' && !input.encryptedCard) {
      return NextResponse.json({ error: 'Informe os dados do cartão.' }, { status: 400 })
    }
    const order = await createPendingOrder(input)
    const customer = { name: order.buyerName, email: order.buyerEmail, taxId: input.taxId }
    const pagbankOrder = input.method === 'PIX'
      ? await createPagBankPixOrder({ referenceId: order.referenceId, amountCents: order.amountCents, description: order.productTitle, customer })
      : await createPagBankCardOrder({ referenceId: order.referenceId, amountCents: order.amountCents, description: order.productTitle, customer, encryptedCard: input.encryptedCard!, installments: input.installments })
    const pagbankCharge = pagbankOrder.charges?.[0]
    const chargeStatus = pagbankCharge?.status ?? null
    const declined = chargeStatus === 'DECLINED' || chargeStatus === 'CANCELED'
    const status = chargeStatus === 'PAID' ? 'PAID' : declined ? 'CANCELED' : 'PENDING'
    await pool.execute(
      `UPDATE glab_orders SET pagbank_order_id = ?, status = ?,
       paid_at = IF(? = 'PAID', NOW(), paid_at), canceled_at = IF(? = 'CANCELED', NOW(), canceled_at)
       WHERE id = ?`,
      [pagbankOrder.id, status, status, status, order.id],
    )
    if (status === 'PAID') {
      try {
        await fulfillPaidOrder(order.id)
      } catch (fulfillError) {
        console.error('[v0] Falha ao liberar acesso do pedido pago', { orderId: order.id, fulfillError })
      }
    }
    if (declined) {
      return NextResponse.json(
        { error: 'O pagamento não foi autorizado pelo banco emissor. Confira os dados do cartão ou use outro meio de pagamento.' },
        { status: 402 },
      )
    }
    const qrCode = pagbankOrder.qr_codes?.[0]
    return NextResponse.json({
      orderId: order.id,
      status,
      chargeStatus: pagbankCharge?.status ?? null,
      pix: qrCode ? { text: qrCode.text, imageUrl: qrCode.links?.find((link) => link.rel === 'QRCODE.PNG')?.href ?? null } : null,
    })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message ?? 'Dados inválidos.' }, { status: 400 })
    console.error('[v0] Checkout error', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Não foi possível iniciar o pagamento.' }, { status: 502 })
  }
}
