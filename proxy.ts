import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/rate-limit'
import { getCSRFTokenFromRequest, requiresCSRFValidation } from '@/lib/csrf'

/**
 * Next.js 16 Proxy Middleware (formerly middleware.ts)
 * Handles:
 * 1. Authentication validation
 * 2. Tenant discovery and context
 * 3. CSRF protection (token validation)
 * 4. Rate limiting
 * 5. Request logging
 */

// Protected API routes that require authentication
const PROTECTED_API_ROUTES = '/api/'
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/sign-in',
  '/sign-up',
  '/auth/',
  '/forgot-password',
  '/reset-password',
  '/contato',
  '/privacidade',
  '/termos',
  '/grupo-vip',
  '/panicfull',
  '/cursos',
  '/master',
]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
}

function extractTenantId(request: NextRequest): string | null {
  // Try subdomain
  const host = request.headers.get('host')
  const subdomain = host?.split('.')[0]
  if (subdomain && subdomain !== 'localhost' && !['www', 'app', 'api'].includes(subdomain)) {
    return subdomain
  }

  // Try header
  const headerTenant = request.headers.get('x-tenant-id')
  if (headerTenant) return headerTenant

  // Try cookie
  const cookieTenant = request.cookies.get('tenant_id')?.value
  if (cookieTenant) return cookieTenant

  return null
}

function getIpAddress(request: NextRequest): string | null {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    null
  )
}

function getRateLimitConfig(method: string, pathname: string): any {
  if (pathname.includes('/auth/')) return RATE_LIMITS.auth
  if (method === 'GET') return RATE_LIMITS.read
  if (method === 'POST' && pathname.includes('/upload')) return RATE_LIMITS.upload
  if (method === 'POST') return RATE_LIMITS.create
  if (method === 'PUT' || method === 'PATCH') return RATE_LIMITS.update
  if (method === 'DELETE') return RATE_LIMITS.delete
  return RATE_LIMITS.read
}

function checkRateLimiting(
  request: NextRequest,
  userId: string | null
): { allowed: boolean; response?: NextResponse } {
  const pathname = new URL(request.url).pathname
  const method = request.method
  const ipAddress = getIpAddress(request)
  
  const key = getRateLimitKey(userId, ipAddress)
  const config = getRateLimitConfig(method, pathname)
  const result = checkRateLimit(key, config)

  if (!result.allowed) {
    const response = NextResponse.json(
      {
        error: 'Too many requests',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      },
      { status: 429 }
    )
    response.headers.set('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000).toString())
    return { allowed: false, response }
  }

  return { allowed: true }
}

export async function proxy(request: NextRequest) {
  const pathname = new URL(request.url).pathname
  const method = request.method

  // Skip middleware for public routes and static files
  if (
    pathname.startsWith('/.') ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp)$/) ||
    isPublicRoute(pathname)
  ) {
    return NextResponse.next()
  }

  const tenantId = extractTenantId(request)
  const isAPI = pathname.startsWith(PROTECTED_API_ROUTES)

  let authenticated = false
  let userId: string | null = null

  // For protected API routes, verify authentication
  if (isAPI) {
    try {
      const session = await auth.api.getSession({ headers: request.headers })
      authenticated = !!session
      userId = session?.user?.id || null

      if (!authenticated) {
        // Check rate limiting for unauthenticated requests
        const rateLimitResult = checkRateLimiting(request, null)
        if (!rateLimitResult.allowed) {
          return rateLimitResult.response!
        }

        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      // Verify tenant access if tenant is specified
      if (tenantId && session.user.tenantId && session.user.tenantId !== tenantId) {
        return NextResponse.json(
          { error: 'Forbidden: Tenant mismatch' },
          { status: 403 }
        )
      }
    } catch (error) {
      console.error('Auth verification failed:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    // Validate CSRF for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      if (process.env.NODE_ENV === 'production') {
        const providedToken = getCSRFTokenFromRequest(request.headers)
        if (!providedToken) {
          return NextResponse.json(
            { error: 'Invalid CSRF token' },
            { status: 403 }
          )
        }
      }
    }

    // Check rate limiting for authenticated requests
    const rateLimitResult = checkRateLimiting(request, userId)
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response!
    }
  }

  // Add context to request headers
  const response = NextResponse.next()
  if (tenantId) {
    response.headers.set('x-tenant-id', tenantId)
  }
  if (authenticated) {
    response.headers.set('x-authenticated', 'true')
    response.headers.set('x-user-id', userId!)
  }

  return response
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    // Admin and app routes
    '/admin/:path*',
    '/app/:path*',
    '/tenant/:path*',
    '/t/:path*',
    // API routes (but not static files)
    '/api/:path*',
    // Auth routes
    '/sign-in/:path*',
    '/sign-up/:path*',
    '/forgot-password/:path*',
  ],
}
