import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ordemServicoTable, clienteTable } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'month' // month, quarter, year

    let dateFilter = new Date()
    if (period === 'quarter') {
      dateFilter.setMonth(dateFilter.getMonth() - 3)
    } else if (period === 'year') {
      dateFilter.setFullYear(dateFilter.getFullYear() - 1)
    } else {
      dateFilter.setMonth(dateFilter.getMonth() - 1)
    }

    // Get revenue data grouped by date
    const revenueData = await db
      .select({
        date: sql`DATE(${ordemServicoTable.dataCriacao})`,
        revenue: sql`SUM(CASE WHEN ${ordemServicoTable.status} = 'concluida' THEN ${ordemServicoTable.valorTotal} ELSE 0 END)`,
        expenses: sql`SUM(CASE WHEN ${ordemServicoTable.status} = 'concluida' THEN ${ordemServicoTable.custoPeca} + ${ordemServicoTable.custoMaoDeObra} ELSE 0 END)`,
      })
      .from(ordemServicoTable)
      .where(sql`${ordemServicoTable.dataCriacao} >= ${dateFilter}`)
      .groupBy(sql`DATE(${ordemServicoTable.dataCriacao})`)
      .orderBy(sql`DATE(${ordemServicoTable.dataCriacao})`)

    return NextResponse.json({
      success: true,
      data: revenueData.map((item: any) => ({
        date: item.date,
        revenue: parseFloat(item.revenue || 0),
        expenses: parseFloat(item.expenses || 0),
        profit: parseFloat(item.revenue || 0) - parseFloat(item.expenses || 0),
      })),
    })
  } catch (error) {
    console.error('Revenue API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch revenue data' },
      { status: 500 }
    )
  }
}
