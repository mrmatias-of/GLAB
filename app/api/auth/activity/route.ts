import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('auth_session')

    if (!authCookie) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Criar resposta e atualizar cookie de atividade
    const response = NextResponse.json({ success: true })

    response.cookies.set('last_activity', Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    return response
  } catch (error) {
    console.error('[Activity API] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar atividade' },
      { status: 500 }
    )
  }
}
