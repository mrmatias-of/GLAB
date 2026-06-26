import { NextRequest, NextResponse } from 'next/server'

const ADMIN_ROUTES = ['/admin']
const LOGIN_ROUTE = '/login'
const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutos

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é uma rota protegida
  const isProtectedRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))
  
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Obter sessão do cookie
  const authCookie = request.cookies.get('auth_session')
  const lastActivityCookie = request.cookies.get('last_activity')

  if (!authCookie) {
    // Sem sessão, redirecionar para login
    return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url))
  }

  // Verificar inatividade
  const lastActivity = lastActivityCookie ? parseInt(lastActivityCookie.value) : Date.now()
  const timeSinceLastActivity = Date.now() - lastActivity

  if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
    // Sessão expirou por inatividade
    const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url))
    response.cookies.delete('auth_session')
    response.cookies.delete('last_activity')
    return response
  }

  // Atualizar último tempo de atividade
  const response = NextResponse.next()
  response.cookies.set('last_activity', Date.now().toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
