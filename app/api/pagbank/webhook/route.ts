import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import type { RowDataPacket } from 'mysql2'
import { fulfillPaidOrder, orderById } from '@/lib/learning-platform'
import { pool } from '@/lib/db'
import { verifyPagBankWebhook } from '@/lib/pagbank'

type PagBankWebhookPayload = {
  id?: string
  reference_id?: string
  checkout_id?: string
  checkout?: { id?: string; reference_id?: string; status?: string }
  order?: { id?: string; reference_id?: string; charges?: Array<{ id?: string; status?: string }> }
  charges?: Array<{ id?: string; status?: string }>
  status?: string
  type?: string
  event?: string
}

function paymentStatus(payload: PagBankWebhookPayload) {
  return payload.charges?.[0]?.status
    ?? payload.order?.charges?.[0]?.status
    ?? payload.checkout?.status
    ?? payload.status
    ?? null
}

function referenceId(payload: PagBankWebhookPayload) {
  return payload.reference_id ?? payload.order?.reference_id ?? payload.checkout?.reference_id ?? null
}

function checkoutId(payload: PagBankWebhookPayload) {
  return payload.checkout_id ?? payload.checkout?.id ?? null
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-pagbank-signature') ?? request.headers.get('x-authenticity-token')
  const configuredSecret = process.env.PAGBANK_WEBHOOK_SECRET
  if (configuredSecret && !verifyPagBankWebhook(rawBody, signature)) {
    return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 401 })
  }
  try {
    const payload = JSON.parse(rawBody) as PagBankWebhookPayload
    const eventId = payload.id ?? crypto.createHash('sha256').update(rawBody).digest('hex')
    const ref = referenceId(payload)
    const checkout = checkoutId(payload)
    const status = paymentStatus(payload)
    const eventType = payload.type ?? payload.event ?? 'PAGBANK_UPDATED'
    const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex')

    const [[existing]] = await pool.execute<Array<RowDataPacket & { id: string }>>(
      `SELECT id FROM glab_orders
       WHERE reference_id = ? OR pagbank_checkout_id = ? OR pagbank_order_id = ?
       LIMIT 1`,
      [ref ?? '', checkout ?? '', payload.order?.id ?? ''],
    )
    const orderId = existing?.id ?? null

    await pool.execute(
      `INSERT INTO glab_payment_events (provider, provider_event_id, order_id, event_type, payment_status, payload_sha256, processed_at)
       VALUES ('PAGBANK', ?, ?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE processed_at = NOW(), payment_status = VALUES(payment_status)`,
      [eventId, orderId, eventType, status, payloadHash],
    )

    if (orderId && status === 'PAID') {
      const order = await orderById(orderId)
      if (order?.status !== 'PAID') await fulfillPaidOrder(orderId)
    } else if (orderId && ['CANCELED', 'DECLINED', 'EXPIRED'].includes(status ?? '')) {
      await pool.execute(`UPDATE glab_orders SET status = 'CANCELED', canceled_at = COALESCE(canceled_at, NOW()) WHERE id = ?`, [orderId])
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[v0] PagBank webhook error', error)
    return NextResponse.json({ error: 'Webhook inválido.' }, { status: 400 })
  }
}
