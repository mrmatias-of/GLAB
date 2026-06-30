import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const mockData = [
      { date: '2024-06-01', entrada: 25000, saida: 18000, saldo: 7000 },
      { date: '2024-06-10', entrada: 28000, saida: 19000, saldo: 16000 },
      { date: '2024-06-20', entrada: 32000, saida: 21000, saldo: 27000 },
    ]

    return NextResponse.json({
      success: true,
      data: mockData,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cash flow' },
      { status: 500 }
    )
  }
}
