import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const mockData = [
      { month: 'Jan', revenue: 45000, orders: 15, completedOrders: 13 },
      { month: 'Fev', revenue: 52000, orders: 18, completedOrders: 16 },
      { month: 'Mar', revenue: 48000, orders: 16, completedOrders: 14 },
      { month: 'Abr', revenue: 61000, orders: 21, completedOrders: 19 },
      { month: 'Mai', revenue: 55000, orders: 19, completedOrders: 17 },
      { month: 'Jun', revenue: 67000, orders: 23, completedOrders: 21 },
    ]

    return NextResponse.json({
      success: true,
      data: mockData,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch monthly trend' },
      { status: 500 }
    )
  }
}
