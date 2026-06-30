import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ordemServicoTable } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'month'

    let dateFilter = new Date()
    if (period === 'quarter') {
      dateFilter.setMonth(dateFilter.getMonth() - 3)
    } else if (period === 'year') {
      dateFilter.setFullYear(dateFilter.getFullYear() - 1)
    } else {
      dateFilter.setMonth(dateFilter.getMonth() - 1)
    }

    const cashFlow = await db
      .select({
        date: sql`DATE(${ordemServicoTable.dataCriacao})`,
        entrada: sql`SUM(CASE WHEN ${ordemServicoTable.status} = 'concluida' AND ${ordemServicoTable.dataPagamento} IS NOT NULL THEN ${ordemServicoTable.valorTotal} ELSE 0 END)`,
        saida: sql`SUM(CASE WHEN ${ordemServicoTable.status} = 'concluida' THEN ${ordemServicoTable.custoPeca} + ${ordemServicoTable.custoMaoDeObra} ELSE 0 END)`,
      })
      .from(ordemServicoTable)
      .where(sql`${ordemServicoTable.dataCriacao} >= ${dateFilter}`)
      .groupBy(sql`DATE(${ordemServicoTable.dataCriacao})`)
      .orderBy(sql`DATE(${ordemServicoTable.dataCriacao})`)

    let saldo = 0
    const data = cashFlow.map((item: any) => {
      const entrada = parseFloat(item.entrada || 0)
      const saida = parseFloat(item.saida || 0)
      saldo += entrada - saida
      return {
        date: item.date,
        entrada,
        saida,
        saldo,
      }
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Cash flow API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cash flow' },
      { status: 500 }
    )
  }
}
