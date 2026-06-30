import { NextRequest, NextResponse } from 'next/server'

// Mock data fallback - Database integration in progress
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'month'

    // Mock revenue data
    const mockData = [
      { date: '2024-06-01', revenue: 45000, expenses: 28000, profit: 17000 },
      { date: '2024-06-05', revenue: 52000, expenses: 31000, profit: 21000 },
      { date: '2024-06-10', revenue: 48000, expenses: 29000, profit: 19000 },
      { date: '2024-06-15', revenue: 61000, expenses: 35000, profit: 26000 },
      { date: '2024-06-20', revenue: 55000, expenses: 32000, profit: 23000 },
      { date: '2024-06-25', revenue: 67000, expenses: 38000, profit: 29000 },
    ]

    return NextResponse.json({
      success: true,
      data: mockData,
    })
  } catch (error) {
    console.error('Revenue API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch revenue data' },
      { status: 500 }
    )
  }
}
