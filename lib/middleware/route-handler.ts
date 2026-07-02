import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getTenantContext } from './tenant-context'
import { createApiError, createApiSuccess } from './api-response'
import { verifyCSRFToken } from '@/lib/security/csrf-protection'
import { checkRateLimit } from '@/lib/security/rate-limit'

export interface RequestContext {
  request: NextRequest
  session: any
  userId: string
  tenantId: string
  headers: any
  params?: any
}

export interface RouteHandlerOptions {
  requireAuth?: boolean
  requireTenant?: boolean
  requireCsrf?: boolean
  rateLimit?: 'global' | 'user' | 'ip' | 'login' | 'create'
  public?: boolean
}

const DEFAULT_OPTIONS: RouteHandlerOptions = {
  requireAuth: true,
  requireTenant: true,
  requireCsrf: true,
  rateLimit: 'user',
  public: false,
}

/**
 * Wraps route handlers with middleware:
 * - Authentication
 * - Tenant context extraction
 * - CSRF validation
 * - Rate limiting
 * - Error handling
 */
export function withMiddleware(
  handler: (context: RequestContext) => Promise<NextResponse>,
  options: RouteHandlerOptions = {}
) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  return async (req: NextRequest) => {
    try {
      // Step 1: Rate limiting (before auth to prevent brute force)
      if (mergedOptions.rateLimit && !mergedOptions.public) {
        const rateLimitResult = await checkRateLimit(req, mergedOptions.rateLimit)
        if (!rateLimitResult.allowed) {
          return createApiError(
            `Rate limit exceeded: ${rateLimitResult.retryAfter}s`,
            429,
            { 'X-RateLimit-RetryAfter': rateLimitResult.retryAfter.toString() }
          )
        }
      }

      // Step 2: Public route handling
      if (mergedOptions.public) {
        const hdrs = await headers()
        const context: RequestContext = {
          request: req,
          session: null,
          userId: 'anonymous',
          tenantId: 'public',
          headers: hdrs,
        }
        return await handler(context)
      }

      // Step 3: Authentication
      const hdrs = await headers()
      const session = await auth.api.getSession({ headers: hdrs })

      if (mergedOptions.requireAuth && !session?.user) {
        return createApiError('Unauthorized: Authentication required', 401)
      }

      const userId = session?.user?.id || 'anonymous'

      // Step 4: Tenant context
      let tenantId = session?.user?.tenantId || null

      if (mergedOptions.requireTenant && !tenantId) {
        // Try to extract from request
        const tenantContext = await getTenantContext(req, session)
        tenantId = tenantContext?.tenantId

        if (!tenantId) {
          return createApiError('Tenant context missing', 400)
        }
      }

      // Step 5: CSRF validation for state-changing requests
      if (mergedOptions.requireCsrf && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const csrfToken = req.headers.get('x-csrf-token')
        const cookieCSRF = hdrs.get('cookie')?.includes('csrf-token')

        if (!csrfToken || !cookieCSRF) {
          return createApiError('CSRF validation failed', 403)
        }

        const csrfValid = await verifyCSRFToken(csrfToken, hdrs)
        if (!csrfValid) {
          return createApiError('Invalid CSRF token', 403)
        }
      }

      // Step 6: Create context and call handler
      const context: RequestContext = {
        request: req,
        session,
        userId,
        tenantId,
        headers: hdrs,
      }

      // Add tenant to request for logging
      console.log(`[API] ${req.method} ${req.nextUrl.pathname} | User: ${userId} | Tenant: ${tenantId}`)

      return await handler(context)
    } catch (error) {
      console.error('[API] Route handler error:', error)
      return createApiError(
        error instanceof Error ? error.message : 'Internal server error',
        500
      )
    }
  }
}

/**
 * Wraps specific HTTP method handlers
 */
export function withMethodMiddleware(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  handler: (context: RequestContext) => Promise<NextResponse>,
  options: RouteHandlerOptions = {}
) {
  return withMiddleware(handler, options)
}
