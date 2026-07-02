import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

/**
 * Centralized Middleware for Phase 1 Critical Requirements:
 * 1. Authentication validation
 * 2. Tenant discovery and context
 * 3. CSRF protection (token validation)
 * 4. Rate limiting preparation
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
function validateCSRFToken(request: NextRequest): boolean {
  // CSRF only needed for state-changing requests (POST, PUT, DELETE, PATCH)
  const method = request.method
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return true
  }

  // For now, just check if header exists
  // TODO: Implement proper token validation in Phase 5
  const csrfToken = request.headers.get(CSRF_HEADER)
  return !!csrfToken || process.env.NODE_ENV === 'development'
}

/**
 * Log request for monitoring
 */
function logRequest(request: NextRequest, tenantId: string | null, authenticated: boolean) {
  const method = request.method
  const pathname = new URL(request.url).pathname
  const timestamp = new Date().toISOString()

  console.log(`[${timestamp}] ${method} ${pathname}`, {
    tenant: tenantId,
    authenticated,
    headers: {
      'user-agent': request.headers.get('user-agent'),
      'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
    },
  })
}

export async function middleware(request: NextRequest) {
  const pathname = new URL(request.url).pathname

  // Extract tenant ID
  const tenantId = extractTenantId(request)

  // Check if route requires authentication
  const isAPI = pathname.startsWith(PROTECTED_API_ROUTES)
  const isPublic = isPublicRoute(pathname)

  // Log request
  let authenticated = false

  // Validate CSRF for state-changing requests
  if (isAPI && !isPublic) {
    const csrfValid = validateCSRFToken(request)
    if (!csrfValid) {
      logRequest(request, tenantId, false)
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }
  }

  // For protected API routes, verify authentication
  if (isAPI && !isPublic) {
    try {
      const session = await auth.api.getSession({ headers: request.headers })
      authenticated = !!session

      if (!authenticated) {
        logRequest(request, tenantId, false)
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      // Verify tenant access if tenant is specified
      if (tenantId && session.user.tenantId && session.user.tenantId !== tenantId) {
        logRequest(request, tenantId, false)
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
  }

  logRequest(request, tenantId, authenticated)

  // Add tenant context to request headers for use in API handlers
  const response = NextResponse.next()
  if (tenantId) {
    response.headers.set('x-tenant-id', tenantId)
  }
  if (authenticated) {
    response.headers.set('x-authenticated', 'true')
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
