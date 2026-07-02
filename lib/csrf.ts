/**
 * CSRF Token Management
 * Generates and validates CSRF tokens for state-changing requests
 */

import crypto from 'crypto'

/**
 * Generate a random CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Hash a CSRF token for storage
 */
export function hashCSRFToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Verify that a provided token matches the expected hash
 */
export function verifyCSRFToken(providedToken: string, expectedHash: string): boolean {
  const providedHash = hashCSRFToken(providedToken)
  return crypto.timingSafeEqual(
    Buffer.from(providedHash),
    Buffer.from(expectedHash)
  )
}

/**
 * Get CSRF token from request headers
 */
export function getCSRFTokenFromRequest(headers: Headers): string | null {
  return headers.get('x-csrf-token') || headers.get('csrf-token') || null
}

/**
 * Check if request requires CSRF validation
 */
export function requiresCSRFValidation(method: string): boolean {
  return ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)
}
