import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const mockData = [
      { id: '1', numero: 'OS-001', clienteNome: 'João Silva', tecnicoNome: 'Pedro', descricao: 'Manutenção AC', status: 'concluida', dataCriacao: '2024-06-20', dataAgendada: '2024-06-21', valorTotal: 500 },
      { id: '2', numero: 'OS-002', clienteNome: 'Maria Santos', tecnicoNome: 'João', descricao: 'Reparo Geladeira', status: 'em_progresso', dataCriacao: '2024-06-25', dataAgendada: '2024-06-26', valorTotal: 350 },
    ]

    return NextResponse.json({
      success: true,
      data: mockData,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
