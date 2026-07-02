import { NextRequest, NextResponse } from 'next/server'

/**
 * Next.js 16 Proxy Middleware (formerly middleware.ts)
 * Handles tenant detection and context
 */

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for public routes and static files
  if (
    pathname.startsWith('/.') ||
    pathname.startsWith('/_next') ||
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/auth/') ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp)$/)
  ) {
    return NextResponse.next()
  }

  // Continue to next middleware/route
  return NextResponse.next()
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    // Admin and app routes
    '/admin/:path*',
    '/app/:path*',
    '/tenant/:path*',
    '/t/:path*',
    // API routes
    '/api/rh/:path*',
    '/api/master/:path*',
    '/api/clientes/:path*',
  ],
}
