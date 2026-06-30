import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ordemServicoTable, clienteTable, tecnicoTable } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20

    let query = db
      .select({
        id: ordemServicoTable.id,
        numero: ordemServicoTable.numero,
        clienteNome: clienteTable.nome,
        tecnicoNome: tecnicoTable.nome,
        descricao: ordemServicoTable.descricao,
        status: ordemServicoTable.status,
        dataCriacao: ordemServicoTable.dataCriacao,
        dataAgendada: ordemServicoTable.dataAgendada,
        valorTotal: ordemServicoTable.valorTotal,
      })
      .from(ordemServicoTable)
      .leftJoin(clienteTable, sql`${ordemServicoTable.clienteId} = ${clienteTable.id}`)
      .leftJoin(tecnicoTable, sql`${ordemServicoTable.tecnicoId} = ${tecnicoTable.id}`)

    if (status) {
      query = query.where(sql`${ordemServicoTable.status} = ${status}`)
    }

    const offset = (page - 1) * limit
    const orders = await query
      .orderBy(sql`${ordemServicoTable.dataCriacao} DESC`)
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total: orders.length,
      },
    })
  } catch (error) {
    console.error('Orders list API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
