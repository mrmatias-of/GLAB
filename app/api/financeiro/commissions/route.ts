import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const mockData = [
      { tecnicoId: '1', tecnicoNome: 'Pedro Santos', totalOrders: 28, totalRevenue: 8500, commission: 850, paid: 400, pending: 450 },
      { tecnicoId: '2', tecnicoNome: 'João Silva', totalOrders: 35, totalRevenue: 10200, commission: 1020, paid: 600, pending: 420 },
    ]

    return NextResponse.json({
      success: true,
      data: mockData,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch commissions' },
      { status: 500 }
    )
  }
}
