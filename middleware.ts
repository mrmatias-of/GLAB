import { NextRequest, NextResponse } from 'next/server'

// Rotas que exigem autenticacao
const PROTECTED_PREFIXES = ['/admin']

// Rotas publicas mesmo dentro de prefixos protegidos
const PUBLIC_PATHS = ['/login', '/auth', '/api/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se e rota publica
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  if (isPublic) return NextResponse.next()

  // Verificar se e rota protegida
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  // Better Auth usa o cookie "better-auth.session_token" em producao
  // e "__Secure-better-auth.session_token" em HTTPS
  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token')

  if (!sessionCookie?.value) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
