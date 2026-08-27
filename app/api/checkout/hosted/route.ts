import { NextResponse } from 'next/server'
import { z } from 'zod'
import { pool } from '@/lib/db'
import { createPendingOrder } from '@/lib/learning-platform'
import { createPagBankHostedCheckout, PagBankError } from '@/lib/pagbank'
import { normalizeEmail, validateEmailForPagBank } from '@/lib/email-validation'

const schema = z.object({
  productSlug: z.string().min(1, 'Curso não informado.').max(120),
  buyerName: z.string().min(3, 'Informe seu nome completo.').max(160, 'Nome muito longo.'),
  buyerEmail: z
    .string()
    .transform(normalizeEmail)
    .superRefine((value, ctx) => {
      const problem = validateEmailForPagBank(value)
      if (problem) ctx.addIssue({ code: z.ZodIssueCode.custom, message: problem })
    }),
})

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json())
    const order = await createPendingOrder(input)
    const checkout = await createPagBankHostedCheckout({
      referenceId: order.referenceId,
      amountCents: order.amountCents,
      description: order.productTitle,
      customer: { name: order.buyerName, email: order.buyerEmail },
      orderId: order.id,
    })

    await pool.execute(
      'UPDATE glab_orders SET pagbank_checkout_id = ?, pagbank_order_id = ?, updated_at = NOW() WHERE id = ?',
      [checkout.checkoutId, checkout.pagbankOrderId, order.id],
    )

    return NextResponse.json({ orderId: order.id, checkoutUrl: checkout.checkoutUrl })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? 'Dados inválidos.' }, { status: 400 })
    }
    if (error instanceof PagBankError) {
      const status = error.status === 400 || error.status === 422 ? 400 : 502
      return NextResponse.json({ error: error.message, details: error.details }, { status })
    }
    console.error('Erro no checkout hospedado PagBank', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Não foi possível abrir o checkout seguro.' }, { status: 502 })
  }
}
