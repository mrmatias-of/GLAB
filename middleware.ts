import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/rate-limit'
import { getCSRFTokenFromRequest, verifyCSRFToken, requiresCSRFValidation } from '@/lib/csrf'

/**
 * Centralized Middleware for Phase 1 Critical Requirements:
 * 1. Authentication validation
 * 2. Tenant discovery and context
 * 3. CSRF protection (token validation)
 * 4. Rate limiting
 * 5. Request logging
 */

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/reset-password',
  '/api/auth/confirm-reset-password',
  '/api/health',
  '/',
  '/login',
  '/signup',
]

// API routes that require authentication
const PROTECTED_API_ROUTES = '/api'

// CSRF token header name
const CSRF_HEADER = 'x-csrf-token'

// Tenant header names
const TENANT_HEADERS = [
  'x-tenant-id',
  'x-tenant-slug',
]

/**
 * Extract tenant ID from request
 * Priority: header > subdomain > domain query param
 */
function extractTenantId(request: NextRequest): string | null {
  // 1. Check x-tenant-id header
  const tenantIdHeader = request.headers.get('x-tenant-id')
  if (tenantIdHeader) return tenantIdHeader

  // 2. Check x-tenant-slug header
  const tenantSlugHeader = request.headers.get('x-tenant-slug')
  if (tenantSlugHeader) return tenantSlugHeader

  // 3. Check subdomain (e.g., company-name.app.com)
  const host = request.headers.get('host') || ''
  const parts = host.split('.')
  if (parts.length > 2) {
    const subdomain = parts[0]
    if (subdomain && subdomain !== 'www') {
      return subdomain
    }
  }

  // 4. Check URL query parameter
  const url = new URL(request.url)
  const tenantFromQuery = url.searchParams.get('tenant')
  if (tenantFromQuery) return tenantFromQuery

  return null
}

/**
 * Check if route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))
}

/**
 * Validate CSRF token for state-changing requests
 */
function validateCSRFToken(request: NextRequest, session: any): boolean {
  const method = request.method
  
  // CSRF only needed for state-changing requests
  if (!requiresCSRFValidation(method)) {
    return true
  }

  // In development, CSRF validation is optional
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  // Get CSRF token from request
  const providedToken = getCSRFTokenFromRequest(request.headers)
  
  // Token must be provided
  if (!providedToken) {
    console.warn('[CSRF] Token missing for state-changing request', {
      method,
      path: new URL(request.url).pathname,
    })
    return false
  }

  // Verify token matches session CSRF hash
  // For now, we accept any token (full implementation requires session storage)
  // TODO: Implement session-based CSRF token storage
  return true
}

/**
 * Get IP address from request
 */
function getIpAddress(request: NextRequest): string | null {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    null
  )
}

/**
 * Determine rate limit config based on request type
 */
function getRateLimitConfig(method: string, pathname: string): any {
  if (pathname.includes('/auth/')) return RATE_LIMITS.auth
  if (method === 'GET') return RATE_LIMITS.read
  if (method === 'POST' && pathname.includes('/upload')) return RATE_LIMITS.upload
  if (method === 'POST') return RATE_LIMITS.create
  if (method === 'PUT' || method === 'PATCH') return RATE_LIMITS.update
  if (method === 'DELETE') return RATE_LIMITS.delete
  return RATE_LIMITS.read
}

/**
 * Check rate limiting for request
 */
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
    const resetTime = new Date(result.resetTime).toISOString()
    console.warn('[RATE_LIMIT] Rate limit exceeded', {
      key,
      method,
      pathname,
      resetTime,
    })
    
    const response = NextResponse.json(
      {
        error: 'Too many requests',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      },
      { status: 429 }
    )
    response.headers.set('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000).toString())
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString())
    
    return { allowed: false, response }
  }

  return { allowed: true }
}

/**
 * Log request for monitoring
 */
function logRequest(
  request: NextRequest,
  tenantId: string | null,
  authenticated: boolean,
  userId: string | null
) {
  const method = request.method
  const pathname = new URL(request.url).pathname
  const timestamp = new Date().toISOString()

  console.log(`[${timestamp}] ${method} ${pathname}`, {
    userId,
    tenant: tenantId,
    authenticated,
    ip: getIpAddress(request),
    userAgent: request.headers.get('user-agent'),
  })
}

export async function middleware(request: NextRequest) {
  const pathname = new URL(request.url).pathname
  const method = request.method

  // Extract tenant ID
  const tenantId = extractTenantId(request)

  // Check if route requires authentication
  const isAPI = pathname.startsWith(PROTECTED_API_ROUTES)
  const isPublic = isPublicRoute(pathname)

  let authenticated = false
  let userId: string | null = null
  let session: any = null

  // For protected API routes, verify authentication first (needed for rate limiting)
  if (isAPI && !isPublic) {
    try {
      session = await auth.api.getSession({ headers: request.headers })
      authenticated = !!session
      userId = session?.user?.id || null

      if (!authenticated) {
        // Check rate limiting for unauthenticated requests
        const rateLimitResult = checkRateLimiting(request, null)
        if (!rateLimitResult.allowed) {
          logRequest(request, tenantId, false, null)
          return rateLimitResult.response!
        }

        logRequest(request, tenantId, false, null)
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      // Verify tenant access if tenant is specified
      if (tenantId && session.user.tenantId && session.user.tenantId !== tenantId) {
        logRequest(request, tenantId, authenticated, userId)
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
    const csrfValid = validateCSRFToken(request, session)
    if (!csrfValid) {
      logRequest(request, tenantId, authenticated, userId)
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }

    // Check rate limiting for authenticated requests
    const rateLimitResult = checkRateLimiting(request, userId)
    if (!rateLimitResult.allowed) {
      logRequest(request, tenantId, authenticated, userId)
      return rateLimitResult.response!
    }
  }

  logRequest(request, tenantId, authenticated, userId)

  // Add context to request headers for use in API handlers
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

/**
 * Configure which routes to run middleware on
 * Run on all API routes and protected pages
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
