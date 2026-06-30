import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ordemServicoTable, tecnicoTable } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tecnicoId = searchParams.get('tecnicoId')
    const period = searchParams.get('period') || 'month'

    let dateFilter = new Date()
    if (period === 'quarter') {
      dateFilter.setMonth(dateFilter.getMonth() - 3)
    } else if (period === 'year') {
      dateFilter.setFullYear(dateFilter.getFullYear() - 1)
    } else {
      dateFilter.setMonth(dateFilter.getMonth() - 1)
    }

    let query = db
      .select({
        tecnicoId: tecnicoTable.id,
        tecnicoNome: tecnicoTable.nome,
        totalOrders: sql`COUNT(*)`,
        totalRevenue: sql`SUM(${ordemServicoTable.valorTotal})`,
        commission: sql`SUM(${ordemServicoTable.valorTotal}) * 0.10`, // 10% commission
        paid: sql`SUM(CASE WHEN ${ordemServicoTable.dataPagamento} IS NOT NULL THEN ${ordemServicoTable.valorTotal} ELSE 0 END) * 0.10`,
        pending: sql`SUM(CASE WHEN ${ordemServicoTable.dataPagamento} IS NULL THEN ${ordemServicoTable.valorTotal} ELSE 0 END) * 0.10`,
      })
      .from(ordemServicoTable)
      .innerJoin(tecnicoTable, sql`${ordemServicoTable.tecnicoId} = ${tecnicoTable.id}`)
      .where(sql`${ordemServicoTable.dataCriacao} >= ${dateFilter} AND ${ordemServicoTable.status} = 'concluida'`)

    if (tecnicoId) {
      query = query.where(sql`${tecnicoTable.id} = ${tecnicoId}`)
    }

    const commissions = await query.groupBy(tecnicoTable.id, tecnicoTable.nome)

    return NextResponse.json({
      success: true,
      data: commissions.map((item: any) => ({
        tecnicoId: item.tecnicoId,
        tecnicoNome: item.tecnicoNome,
        totalOrders: parseInt(item.totalOrders || 0),
        totalRevenue: parseFloat(item.totalRevenue || 0),
        commission: parseFloat(item.commission || 0),
        paid: parseFloat(item.paid || 0),
        pending: parseFloat(item.pending || 0),
      })),
    })
  } catch (error) {
    console.error('Commissions API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch commissions' },
      { status: 500 }
    )
  }
}
