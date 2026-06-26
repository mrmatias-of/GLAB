import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Para teste: aceitar admin@glabcursos.com / Larissa@123
    if (email === 'admin@glabcursos.com' && password === 'Larissa@123') {
      // Criar cookie de sessão simples
      const response = NextResponse.json(
        { 
          success: true,
          user: { email, name: 'Admin' }
        },
        { status: 200 }
      )

      // Set cookie para manter login
      response.cookies.set('auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 dias
        path: '/',
      })

      return response
    }

    // Credenciais inválidas
    return NextResponse.json(
      { error: 'Email ou senha incorretos' },
      { status: 401 }
    )
  } catch (error) {
    console.error('[v0] Signin error:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}
