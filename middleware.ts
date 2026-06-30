import { NextRequest, NextResponse } from 'next/server'

const ADMIN_ROUTES = ['/admin']
const LOGIN_ROUTE = '/login'
const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutos

// Padrão para rotas de tenant: /{tenantSlug}/*
const TENANT_ROUTE_PATTERN = /^\/([a-z0-9-]+)(?:\/|$)/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é rota de admin (master)
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))
  
  // Verificar se é rota de tenant: /{tenantSlug}/*
  const tenantMatch = pathname.match(TENANT_ROUTE_PATTERN)
  const isTenantRoute = tenantMatch && !isAdminRoute

  // Rotas públicas (sem proteção)
  const isPublicRoute = pathname === '/login' || 
                       pathname === '/' || 
                       pathname.startsWith('/api/auth') ||
                       pathname.startsWith('/public')

  if (isPublicRoute) {
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

  // Para rotas de tenant, armazenar o slug no header para uso posterior
  const response = NextResponse.next()
  
  if (isTenantRoute && tenantMatch[1]) {
    response.headers.set('x-tenant-slug', tenantMatch[1])
  }

  // Atualizar último tempo de atividade
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
    '/:tenant/:path*',
  ],
}
