import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import type { RowDataPacket } from 'mysql2'
import { fulfillPaidOrder, orderById } from '@/lib/learning-platform'
import { pool } from '@/lib/db'
import { verifyPagBankWebhook } from '@/lib/pagbank'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-pagbank-signature') ?? request.headers.get('x-authenticity-token')
  const configuredSecret = process.env.PAGBANK_WEBHOOK_SECRET
  if (configuredSecret && !verifyPagBankWebhook(rawBody, signature)) {
    return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 401 })
  }
  try {
    const payload = JSON.parse(rawBody) as { id?: string; reference_id?: string; charges?: Array<{ id?: string; status?: string }>; type?: string }
    const eventId = payload.id ?? crypto.createHash('sha256').update(rawBody).digest('hex')
    const referenceId = payload.reference_id
    const status = payload.charges?.[0]?.status ?? null
    const [[existing]] = await pool.execute<Array<RowDataPacket & { id: string }>>('SELECT id FROM glab_orders WHERE reference_id = ? LIMIT 1', [referenceId ?? ''])
    const orderId = existing?.id ?? null
    await pool.execute(
      `INSERT INTO glab_payment_events (provider, provider_event_id, order_id, event_type, payment_status, payload_sha256, processed_at)
       VALUES ('PAGBANK', ?, ?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE processed_at = NOW()`,
      [eventId, orderId, payload.type ?? 'ORDER_UPDATED', status, crypto.createHash('sha256').update(rawBody).digest('hex')],
    )
    if (orderId && status === 'PAID') {
      const order = await orderById(orderId)
      if (order?.status !== 'PAID') await fulfillPaidOrder(orderId)
    } else if (orderId && ['CANCELED', 'DECLINED'].includes(status ?? '')) {
      await pool.execute(`UPDATE glab_orders SET status = 'CANCELED', canceled_at = COALESCE(canceled_at, NOW()) WHERE id = ?`, [orderId])
    }
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[v0] PagBank webhook error', error)
    return NextResponse.json({ error: 'Webhook inválido.' }, { status: 400 })
  }
}
