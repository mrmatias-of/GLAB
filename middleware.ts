import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'

const publicRoutes = ['/', '/login', '/cursos', '/suporte']
const adminRoutes = ['/admin']
const supportAdminRoutes = ['/admin/suporte']
const protectedRoutes = ['/suporte']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const response = NextResponse.next()

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route)) && !adminRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isSupportAdminRoute = supportAdminRoutes.some(route => pathname.startsWith(route))
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute) {
    return response
  }

  // Get JWT token from cookie
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    if (isAdminRoute || isProtectedRoute) {
      return NextResponse.redirect(new URL('/login?next=' + pathname, request.url))
    }
    return response
  }

  // Verify token (lightweight JWT verification, no DB calls)
  const userId = await verifySession(token)

  if (!userId) {
    const res = NextResponse.redirect(new URL('/login?next=' + pathname, request.url))
    res.cookies.delete('auth_token')
    return res
  }

  // For admin/support routes, let the route handler verify role via API
  // This avoids using Prisma in Edge Middleware
  if (isAdminRoute || isSupportAdminRoute) {
    // Still block if not authenticated
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', String(userId))
    requestHeaders.set('x-auth-token', token)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Set user info in response headers for other protected routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', String(userId))
  requestHeaders.set('x-auth-token', token)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
