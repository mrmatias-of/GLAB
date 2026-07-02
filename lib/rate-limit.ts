/**
 * Rate Limiting Utility
 * Uses in-memory storage for rate limiting (suitable for single-server deployments)
 * For distributed deployments, use Redis or Upstash
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

// Default rate limits per endpoint type
export const RATE_LIMITS = {
  auth: { windowMs: 60 * 1000, maxRequests: 5 }, // 5 per minute
  read: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 per minute
  create: { windowMs: 60 * 1000, maxRequests: 20 }, // 20 per minute
  update: { windowMs: 60 * 1000, maxRequests: 20 }, // 20 per minute
  delete: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 per minute
  upload: { windowMs: 60 * 1000, maxRequests: 5 }, // 5 per minute
}

/**
 * Check if request should be rate limited
 * Returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  let entry = rateLimitStore.get(key)

  // Clean up old entries
  if (entry && now >= entry.resetTime) {
    rateLimitStore.delete(key)
    entry = undefined
  }

  // Initialize or update entry
  if (!entry) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    }
  } else {
    entry.count += 1
  }

  rateLimitStore.set(key, entry)

  const allowed = entry.count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - entry.count)

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  }
}

/**
 * Get rate limit key for a request
 * Combines user ID (authenticated) or IP address (anonymous)
 */
export function getRateLimitKey(userId: string | null, ipAddress: string | null): string {
  if (userId) {
    return `user:${userId}`
  }
  return `ip:${ipAddress || 'unknown'}`
}

/**
 * Clean up expired entries periodically
 * Call this on server startup
 */
export function startCleanupTimer(intervalMs: number = 60 * 1000): NodeJS.Timer {
  return setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now >= entry.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }, intervalMs)
}
