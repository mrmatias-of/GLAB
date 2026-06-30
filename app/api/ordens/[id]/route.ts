import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ordemServicoTable, clienteTable, tecnicoTable, equipamentoTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await db
      .select({
        ordem: ordemServicoTable,
        cliente: clienteTable,
        tecnico: tecnicoTable,
        equipamento: equipamentoTable,
      })
      .from(ordemServicoTable)
      .leftJoin(clienteTable, eq(ordemServicoTable.clienteId, clienteTable.id))
      .leftJoin(tecnicoTable, eq(ordemServicoTable.tecnicoId, tecnicoTable.id))
      .leftJoin(equipamentoTable, eq(ordemServicoTable.equipamentoId, equipamentoTable.id))
      .where(eq(ordemServicoTable.id, params.id))
      .limit(1)

    if (!order || order.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order[0],
    })
  } catch (error) {
    console.error('Order detail API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
