import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { account, user } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { securityLogger } from '@/lib/security-logger'

// Rate limiting: Map de IP -> tentativas falhadas
const loginAttempts = new Map<string, { count: number; timestamp: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutos

// Função para verificar rate limit
function checkRateLimit(ipAddress: string): boolean {
  const now = Date.now()
  const attempt = loginAttempts.get(ipAddress)

  if (!attempt) {
    loginAttempts.set(ipAddress, { count: 0, timestamp: now })
    return true
  }

  // Limpar tentativas após lockout expirar
  if (now - attempt.timestamp > LOCKOUT_DURATION) {
    loginAttempts.set(ipAddress, { count: 0, timestamp: now })
    return true
  }

  // Verificar se ainda está em lockout
  if (attempt.count >= MAX_ATTEMPTS) {
    return false
  }

  return true
}

// Função para registrar tentativa falhada
function recordFailedAttempt(ipAddress: string) {
  const attempt = loginAttempts.get(ipAddress) || { count: 0, timestamp: Date.now() }
  attempt.count++
  loginAttempts.set(ipAddress, attempt)
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    // Validação básica
    if (!email || !password) {
      securityLogger.logLoginFailed(email || 'unknown', ipAddress, 'Missing email or password')
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar rate limiting
    if (!checkRateLimit(ipAddress)) {
      securityLogger.logRateLimit(email, ipAddress, MAX_ATTEMPTS)
      return NextResponse.json(
        { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
        { status: 429 }
      )
    }

    // Buscar usuário no banco de dados
    const userRecord = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1)

    if (userRecord.length === 0) {
      recordFailedAttempt(ipAddress)
      securityLogger.logLoginFailed(email, ipAddress, 'User not found')
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    // Buscar account com password hash
    const accountRecord = await db
      .select()
      .from(account)
      .where(and(eq(account.userId, userRecord[0].id), eq(account.providerId, 'credential')))
      .limit(1)

    if (accountRecord.length === 0 || !accountRecord[0].password) {
      recordFailedAttempt(ipAddress)
      securityLogger.logLoginFailed(email, ipAddress, 'No password configured')
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    // Validar senha com bcrypt
    const passwordValid = await bcrypt.compare(password, accountRecord[0].password)

    if (!passwordValid) {
      recordFailedAttempt(ipAddress)
      securityLogger.logLoginFailed(email, ipAddress, 'Invalid password')
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    // Login bem-sucedido - limpar tentativas falhadas
    loginAttempts.delete(ipAddress)

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: userRecord[0].id,
          email: userRecord[0].email,
          name: userRecord[0].name,
        },
      },
      { status: 200 }
    )

    // Set session cookie (httpOnly para segurança)
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
    response.cookies.set('auth_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 horas máximo
      path: '/',
    })

    // Set activity timestamp
    response.cookies.set('last_activity', Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    })

    securityLogger.logLoginSuccess(email, ipAddress, request.headers.get('user-agent') || undefined)

    return response
  } catch (error) {
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    securityLogger.logLoginFailed('unknown', ipAddress, `Server error: ${errorMessage}`)

    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}
