import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Logout realizado com sucesso' },
      { status: 200 }
    )

    // Limpar cookies de sessão
    response.cookies.delete('auth_session')
    response.cookies.delete('last_activity')

    return response
  } catch (error) {
    console.error('[Logout API] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    )
  }
}
