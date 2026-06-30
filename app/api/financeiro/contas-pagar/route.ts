import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ordemServicoTable } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') // pending, paid, overdue
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20

    let query = db
      .select({
        id: ordemServicoTable.id,
        numero: ordemServicoTable.numero,
        fornecedor: ordemServicoTable.fornecedor,
        descricao: ordemServicoTable.descricao,
        total: sql`${ordemServicoTable.custoPeca} + ${ordemServicoTable.custoMaoDeObra}`,
        dataVencimento: ordemServicoTable.dataVencimento,
        dataPagamento: ordemServicoTable.dataPagamento,
        status: sql`CASE WHEN ${ordemServicoTable.dataPagamento} IS NOT NULL THEN 'paid' WHEN ${ordemServicoTable.dataVencimento} < NOW() THEN 'overdue' ELSE 'pending' END`,
      })
      .from(ordemServicoTable)
      .where(sql`${ordemServicoTable.custoPeca} > 0 OR ${ordemServicoTable.custoMaoDeObra} > 0`)

    if (status === 'pending') {
      query = query.where(sql`${ordemServicoTable.dataPagamento} IS NULL AND ${ordemServicoTable.dataVencimento} >= NOW()`)
    } else if (status === 'overdue') {
      query = query.where(sql`${ordemServicoTable.dataPagamento} IS NULL AND ${ordemServicoTable.dataVencimento} < NOW()`)
    } else if (status === 'paid') {
      query = query.where(sql`${ordemServicoTable.dataPagamento} IS NOT NULL`)
    }

    const offset = (page - 1) * limit
    const accounts = await query
      .orderBy(sql`${ordemServicoTable.dataVencimento}`)
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      data: accounts,
      pagination: { page, limit },
    })
  } catch (error) {
    console.error('Contas Pagar API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch accounts payable' },
      { status: 500 }
    )
  }
}
