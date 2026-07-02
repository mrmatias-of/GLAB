import { NextRequest, NextResponse } from 'next/server'
import { securityLogger } from '@/lib/security-logger'

export async function POST(request: NextRequest) {
  try {
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const email = request.cookies.get('user_email')?.value || 'unknown'

    const response = NextResponse.json(
      { success: true, message: 'Logout realizado com sucesso' },
      { status: 200 }
    )

    // Limpar cookies de sessão
    response.cookies.delete('auth_session')
    response.cookies.delete('last_activity')

    // Log de logout bem-sucedido
    securityLogger.logLogout(email, ipAddress)

    return response
  } catch (error) {
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    securityLogger.logLoginFailed('unknown', ipAddress, `Logout error: ${errorMessage}`)

    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    )
  }
}
