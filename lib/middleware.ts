import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'
import { prisma } from '@/lib/db'

const publicRoutes = ['/', '/login', '/cursos', '/suporte']
const adminRoutes = ['/admin']
const supportAdminRoutes = ['/admin/suporte']
const protectedRoutes = ['/suporte']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const response = NextResponse.next()

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isSupportAdminRoute = supportAdminRoutes.some(route => pathname.startsWith(route))
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Get JWT token from cookie
  const token = request.cookies.get('auth_token')?.value

  if (isPublicRoute && !isAdminRoute && !isProtectedRoute) {
    return response
  }

  if (!token) {
    if (isAdminRoute || isProtectedRoute) {
      return NextResponse.redirect(new URL('/login?next=' + pathname, request.url))
    }
    return response
  }

  // Verify token
  const userId = await verifySession(token)

  if (!userId) {
    // Token is invalid/expired
    const res = NextResponse.redirect(new URL('/login?next=' + pathname, request.url))
    res.cookies.delete('auth_token')
    return res
  }

  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    const res = NextResponse.redirect(new URL('/login', request.url))
    res.cookies.delete('auth_token')
    return res
  }

  // Check admin routes
  if (isAdminRoute && !user.is_admin) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Check support admin routes (admin or vendedor)
  if (isSupportAdminRoute && !user.is_admin && !user.is_vendedor) {
    return NextResponse.redirect(new URL('/suporte/meus-tickets', request.url))
  }

  // Set user info in response headers for server components
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', userId)
  requestHeaders.set('x-user-email', user.email)
  requestHeaders.set('x-user-admin', String(user.is_admin))
  requestHeaders.set('x-user-vendedor', String(user.is_vendedor))

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
