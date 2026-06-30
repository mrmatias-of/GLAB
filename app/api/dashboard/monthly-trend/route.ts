import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ordemServicoTable } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const trendData = await db
      .select({
        month: sql`DATE_TRUNC('month', ${ordemServicoTable.dataCriacao})`,
        revenue: sql`SUM(CASE WHEN ${ordemServicoTable.status} = 'concluida' THEN ${ordemServicoTable.valorTotal} ELSE 0 END)`,
        orders: sql`COUNT(*)`,
        completedOrders: sql`COUNT(CASE WHEN ${ordemServicoTable.status} = 'concluida' THEN 1 END)`,
      })
      .from(ordemServicoTable)
      .where(sql`${ordemServicoTable.dataCriacao} >= NOW() - INTERVAL '12 months'`)
      .groupBy(sql`DATE_TRUNC('month', ${ordemServicoTable.dataCriacao})`)
      .orderBy(sql`DATE_TRUNC('month', ${ordemServicoTable.dataCriacao})`)

    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

    return NextResponse.json({
      success: true,
      data: trendData.map((item: any) => {
        const date = new Date(item.month)
        return {
          month: monthNames[date.getMonth()],
          revenue: parseFloat(item.revenue || 0),
          orders: parseInt(item.orders || 0),
          completedOrders: parseInt(item.completedOrders || 0),
        }
      }),
    })
  } catch (error) {
    console.error('Monthly trend API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch monthly trend' },
      { status: 500 }
    )
  }
}
