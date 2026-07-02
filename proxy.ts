import { NextRequest, NextResponse } from 'next/server'
import { detectTenant, setTenantContext, validateTenantAccess } from '@/lib/middleware/tenant-middleware'
import { auth } from '@/lib/auth'

/**
 * Next.js 16 Proxy Middleware (formerly middleware.ts)
 * 
 * Runs on every request:
 * 1. Detect tenant from subdomain/path/header
 * 2. Validate user session
 * 3. Verify tenant access
 * 4. Set tenant context in headers/cookies
 */

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for public routes, static files, and master admin
  if (
    pathname.startsWith('/.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/master') ||
    pathname.startsWith('/master') ||
    pathname.startsWith('/public') ||
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/auth/') ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)
  ) {
    return NextResponse.next()
  }

  // Detect tenant
  const tenantInfo = await detectTenant(request)

  if (!tenantInfo) {
    // If no tenant detected and trying to access protected route, redirect to login
    if (pathname.startsWith('/admin') || pathname.startsWith('/app')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Get session (implement based on your auth setup)
  const session = await getSession(request)

  // If protected route and no session, redirect to login
  if ((pathname.startsWith('/admin') || pathname.startsWith('/app')) && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user session exists, validate tenant access
  if (session && session.userId) {
    const hasAccess = await validateTenantAccess(session.userId, tenantInfo.tenantId)

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied to this tenant' },
        { status: 403 }
      )
    }
  }

  // Set tenant context
  let response = NextResponse.next()
  response = setTenantContext(response, tenantInfo)

  // Add tenant info to request headers for use in pages/APIs
  response.headers.set('X-Tenant-ID', tenantInfo.tenantId)
  response.headers.set('X-Tenant-Slug', tenantInfo.tenantSlug)
  response.headers.set('X-Database-URL', tenantInfo.databaseUrl)

  return response
}

/**
 * Get session from request
 * Adapt to your auth provider (Better Auth, NextAuth, etc)
 */
async function getSession(request: NextRequest) {
  try {
    // Example: Extract from cookie or header
    const sessionToken = request.cookies.get('session')?.value
    if (!sessionToken) return null

    // Validate and decode token based on your auth setup
    // This is a placeholder - implement based on your actual auth
    return { userId: 'user-id' }
  } catch (error) {
    return null
  }
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    // Admin and app routes
    '/admin/:path*',
    '/app/:path*',
    '/tenant/:path*',
    '/t/:path*',
    // API routes for tenant
    '/api/rh/:path*',
    '/api/tenant/:path*',
    '/api/clientes/:path*',
    // Exclude public routes, static files, and master
  ],
}
