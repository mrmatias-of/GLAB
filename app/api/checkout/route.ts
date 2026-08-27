import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createPagBankCardOrder, createPagBankPixOrder } from '@/lib/pagbank'
import { createPendingOrder } from '@/lib/learning-platform'
import { pool } from '@/lib/db'

const schema = z.object({
  productSlug: z.string().min(1).max(120),
  buyerName: z.string().min(3).max(160),
  buyerEmail: z.string().email().max(254),
  taxId: z.string().regex(/^\\d{11}$/, 'CPF inválido'),
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
    const status = pagbankCharge?.status === 'PAID' ? 'PAID' : 'PENDING'
    await pool.execute(
      `UPDATE glab_orders SET pagbank_order_id = ?, status = ?, paid_at = IF(? = 'PAID', NOW(), NULL) WHERE id = ?`,
      [pagbankOrder.id, status, status, order.id],
    )
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
