import { NextResponse } from 'next/server'
import { orderById } from '@/lib/learning-platform'
import { getPagBankOrder } from '@/lib/pagbank'
import { pool } from '@/lib/db'

export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const order = await orderById(orderId)
  if (!order) return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 })
  if (order.pagbankOrderId && order.status === 'PENDING') {
    try {
      const remote = await getPagBankOrder(order.pagbankOrderId)
      const status = remote.charges?.[0]?.status === 'PAID' ? 'PAID' : remote.charges?.[0]?.status === 'CANCELED' ? 'CANCELED' : 'PENDING'
      if (status !== order.status) await pool.execute(`UPDATE glab_orders SET status = ?, paid_at = IF(? = 'PAID', NOW(), paid_at), canceled_at = IF(? = 'CANCELED', NOW(), canceled_at) WHERE id = ?`, [status, status, status, orderId])
      return NextResponse.json({ status })
    } catch (error) {
      console.error('[v0] PagBank status check failed', error)
    }
  }
  return NextResponse.json({ status: order.status })
}
