import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params } { id: string } }
) {
  try {
    const mockOrder = {
      ordem: { id: await params.id, numero: 'OS-001', descricao: 'Manutenção AC', status: 'concluida', valorTotal: 500 },
      cliente: { nome: 'João Silva' },
      tecnico: { nome: 'Pedro' },
      equipamento: { nome: 'Ar Condicionado' },
    }

    return NextResponse.json({
      success: true,
      data: mockOrder,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
