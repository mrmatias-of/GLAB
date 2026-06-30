import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const mockData = [
      { id: '3', numero: '#CR-001', clienteNome: 'João Silva', descricao: 'Manutenção', total: 500, dataVencimento: '2024-07-10', dataPagamento: '2024-07-12', status: 'paid' },
      { id: '4', numero: '#CR-002', clienteNome: 'Maria Santos', descricao: 'Instalação', total: 1200, dataVencimento: '2024-07-20', status: 'pending' },
    ]

    return NextResponse.json({
      success: true,
      data: mockData,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch accounts receivable' },
      { status: 500 }
    )
  }
}
