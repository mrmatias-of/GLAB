import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  ordens_servico,
  clientes,
  tecnicos,
  servicos,
} from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total orders
    const allOrders = await db
      .select()
      .from(ordens_servico)
      .where(eq(ordens_servico.userId, userId))

    const totalOrders = allOrders.length

    // Get pending orders (aberto, em_progresso)
    const pendingOrders = allOrders.filter(
      (o) => o.status === 'aberto' || o.status === 'em_progresso'
    ).length

    // Get completed orders
    const completedOrders = allOrders.filter(
      (o) => o.status === 'finalizado'
    ).length

    // Get total clients
    const allClients = await db
      .select()
      .from(clientes)
      .where(eq(clientes.userId, userId))
    const totalClients = allClients.length

    // Get total technicians
    const allTechnicians = await db
      .select()
      .from(tecnicos)
      .where(eq(tecnicos.userId, userId))
    const totalTechnicians = allTechnicians.length

    // Calculate total revenue (sum of valor_final for completed orders)
    const totalRevenue = allOrders
      .filter((o) => o.status === 'finalizado' && o.valor_final)
      .reduce((sum, o) => {
        return sum + (parseFloat(o.valor_final?.toString() || '0') || 0)
      }, 0)

    // Get average order value
    const avgOrderValue =
      completedOrders > 0 ? totalRevenue / completedOrders : 0

    // Get this month's orders
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const ordersThisMonth = allOrders.filter((o) => {
      return (
        new Date(o.data_abertura) >= thisMonth &&
        o.status === 'finalizado'
      )
    }).length

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalClients,
        totalTechnicians,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
        ordersThisMonth,
        revenueThisMonth: allOrders
          .filter((o) => {
            return (
              new Date(o.data_abertura) >= thisMonth &&
              o.status === 'finalizado' &&
              o.valor_final
            )
          })
          .reduce((sum, o) => {
            return sum + (parseFloat(o.valor_final?.toString() || '0') || 0)
          }, 0),
      },
    })
  } catch (error) {
    console.error('[Dashboard Stats API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
