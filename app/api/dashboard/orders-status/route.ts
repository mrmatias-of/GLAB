import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ordemServicoTable } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const statusData = await db
      .select({
        status: ordemServicoTable.status,
        count: sql`COUNT(*)`,
      })
      .from(ordemServicoTable)
      .groupBy(ordemServicoTable.status)

    const statusMap: Record<string, string> = {
      'pendente': 'Pendente',
      'em_progresso': 'Em Progresso',
      'concluida': 'Concluída',
      'cancelada': 'Cancelada',
    }

    const colors: Record<string, string> = {
      'pendente': '#FFA500',
      'em_progresso': '#3B82F6',
      'concluida': '#10B981',
      'cancelada': '#EF4444',
    }

    return NextResponse.json({
      success: true,
      data: statusData.map((item: any) => ({
        name: statusMap[item.status] || item.status,
        value: parseInt(item.count || 0),
        fill: colors[item.status] || '#9CA3AF',
      })),
    })
  } catch (error) {
    console.error('Orders status API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders status' },
      { status: 500 }
    )
  }
}
