import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const mockData = [
      { name: 'João Silva', totalOrders: 28, completedOrders: 25, revenue: 8500, rating: 4.8, completionRate: 89 },
      { name: 'Maria Santos', totalOrders: 35, completedOrders: 32, revenue: 10200, rating: 4.9, completionRate: 91 },
      { name: 'Pedro Santos', totalOrders: 22, completedOrders: 20, revenue: 6800, rating: 4.7, completionRate: 91 },
    ]

    return NextResponse.json({
      success: true,
      data: mockData,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch technician performance' },
      { status: 500 }
    )
  }
}
