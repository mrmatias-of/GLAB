import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // TODO: Implement proper authentication with database
    // For now, only admin@glabcursos.com can login
    if (email !== 'admin@glabcursos.com') {
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    // Create session response
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: 'admin-001',
          email: 'admin@glabcursos.com',
          name: 'Administrador',
        },
      },
      { status: 200 }
    )

    // Set session cookie
    response.cookies.set('better-auth.session_token', 'session_' + Date.now(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}
