import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Login route - Starting authentication')
    console.log('[v0] NODE_ENV:', process.env.NODE_ENV)
    console.log('[v0] DATABASE_URL defined:', !!process.env.DATABASE_URL)
    
    const { email, password } = await request.json()
    console.log('[v0] Request data received:', { email, passwordLength: password?.length })

    if (!email || !password) {
      console.log('[v0] Validation error: missing email or password')
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    console.log('[v0] Calling login function...')
    const { token, user } = await login(email, password)
    console.log('[v0] Login successful for user:', user.email)

    const response = NextResponse.json({ user }, { status: 200 })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[v0] Login route error:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error,
    })
    
    // Adicional diagnostics para problemas de conexão
    if (error instanceof Error && error.message.includes('connection')) {
      console.error('[v0] CONNECTION ERROR - Verificar:')
      console.error('[v0] - Firewall Locaweb whitelist IP')
      console.error('[v0] - DATABASE_URL no Vercel Dashboard')
      console.error('[v0] - Credentials MySQL')
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao fazer login' },
      { status: 401 }
    )
  }
}
