import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ordemServicoTable, tecnicoTable } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const performanceData = await db
      .select({
        tecnicoId: ordemServicoTable.tecnicoId,
        tecnicoNome: tecnicoTable.nome,
        totalOrders: sql`COUNT(*)`,
        completedOrders: sql`COUNT(CASE WHEN ${ordemServicoTable.status} = 'concluida' THEN 1 END)`,
        totalRevenue: sql`SUM(CASE WHEN ${ordemServicoTable.status} = 'concluida' THEN ${ordemServicoTable.valorTotal} ELSE 0 END)`,
        avgRating: sql`AVG(CASE WHEN ${ordemServicoTable.avaliacaoCliente} IS NOT NULL THEN ${ordemServicoTable.avaliacaoCliente} ELSE NULL END)`,
      })
      .from(ordemServicoTable)
      .innerJoin(tecnicoTable, sql`${ordemServicoTable.tecnicoId} = ${tecnicoTable.id}`)
      .groupBy(ordemServicoTable.tecnicoId, tecnicoTable.nome)
      .orderBy(sql`SUM(CASE WHEN ${ordemServicoTable.status} = 'concluida' THEN ${ordemServicoTable.valorTotal} ELSE 0 END) DESC`)
      .limit(10)

    return NextResponse.json({
      success: true,
      data: performanceData.map((item: any) => ({
        name: item.tecnicoNome,
        totalOrders: parseInt(item.totalOrders || 0),
        completedOrders: parseInt(item.completedOrders || 0),
        revenue: parseFloat(item.totalRevenue || 0),
        rating: parseFloat(item.avgRating || 0),
        completionRate: item.totalOrders > 0 ? ((item.completedOrders / item.totalOrders) * 100).toFixed(1) : 0,
      })),
    })
  } catch (error) {
    console.error('Technician performance API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch technician performance' },
      { status: 500 }
    )
  }
}
