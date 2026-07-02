import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'

/**
 * CSRF (Cross-Site Request Forgery) Protection
 * Implements double-submit cookie pattern
 */

const CSRF_HEADER_NAME = 'x-csrf-token'
const CSRF_COOKIE_NAME = '__csrf_token'
const CSRF_COOKIE_OPTIONS = {
  httpOnly: false, // Must be readable by JavaScript for form submission
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24, // 24 hours
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Hash CSRF token for comparison
 */
function hashCSRFToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Verify CSRF token
 * Token should be in:
 * 1. Cookie (set by server)
 * 2. Request header (sent by client)
 */
export function verifyCSRFToken(request: NextRequest): {
  valid: boolean
  error?: string
} {
  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value

  if (!cookieToken) {
    return { valid: false, error: 'CSRF token not found in cookies' }
  }

  // Get token from header
  const headerToken = request.headers.get(CSRF_HEADER_NAME)

  if (!headerToken) {
    return { valid: false, error: 'CSRF token not found in headers' }
  }

  // Verify they match
  if (cookieToken !== headerToken) {
    return { valid: false, error: 'CSRF token mismatch' }
  }

  return { valid: true }
}

/**
 * Set CSRF token in response
 */
export function setCSRFCookie(response: NextResponse): NextResponse {
  const token = generateCSRFToken()

  response.cookies.set(CSRF_COOKIE_NAME, token, {
    ...CSRF_COOKIE_OPTIONS,
    path: '/',
  })

  // Also set as response header
  response.headers.set('X-CSRF-Token', token)

  return response
}

/**
 * Get CSRF token from request for logging/debugging
 */
export function getCSRFToken(request: NextRequest): string | null {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value || null
}

/**
 * CSRF validation for state-changing requests
 * Call this in middleware for POST/PUT/DELETE/PATCH
 */
export function shouldValidateCSRF(method: string): boolean {
  return ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)
}

/**
 * For development, allow CSRF bypass
 */
export function isCSRFBypassAllowed(): boolean {
  return process.env.NODE_ENV === 'development' && 
         process.env.CSRF_BYPASS_DEV === 'true'
}
