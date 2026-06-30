import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const mockData = [
      { name: 'Pendente', value: 18, fill: '#FFA500' },
      { name: 'Em Progresso', value: 32, fill: '#3B82F6' },
      { name: 'Concluída', value: 145, fill: '#10B981' },
      { name: 'Cancelada', value: 5, fill: '#EF4444' },
    ]

    return NextResponse.json({
      success: true,
      data: mockData,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders status' },
      { status: 500 }
    )
  }
}
