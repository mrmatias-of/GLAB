import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const mockData = [
      { id: '1', numero: '#CP-001', fornecedor: 'Fornecedor A', descricao: 'Peças', total: 2500, dataVencimento: '2024-07-15', status: 'pending' },
      { id: '2', numero: '#CP-002', fornecedor: 'Fornecedor B', descricao: 'Aluguel', total: 3000, dataVencimento: '2024-07-05', status: 'overdue' },
    ]

    return NextResponse.json({
      success: true,
      data: mockData,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch accounts payable' },
      { status: 500 }
    )
  }
}
