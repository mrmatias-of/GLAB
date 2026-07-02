import { NextRequest, NextResponse } from 'next/server'

/**
 * Rate Limiting Implementation
 * Uses in-memory storage (production should use Redis)
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store (replace with Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 60 * 1000)

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  // Requests per window
  limit: number
  // Time window in milliseconds
  window: number
  // Key generator function
  keyGenerator: (request: NextRequest) => string
}

/**
 * Default configurations
 */
export const RATE_LIMIT_DEFAULTS = {
  // Global API rate limit: 1000 requests per minute
  GLOBAL: {
    limit: 1000,
    window: 60 * 1000,
  },
  // Per-user rate limit: 100 requests per minute
  PER_USER: {
    limit: 100,
    window: 60 * 1000,
  },
  // Per-IP rate limit: 50 requests per minute
  PER_IP: {
    limit: 50,
    window: 60 * 1000,
  },
  // Login endpoint: 10 attempts per 15 minutes
  LOGIN: {
    limit: 10,
    window: 15 * 60 * 1000,
  },
  // API create: 20 per minute
  CREATE: {
    limit: 20,
    window: 60 * 1000,
  },
}

/**
 * Check rate limit
 * Returns: { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
  key: string,
  config: { limit: number; window: number }
): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  // New entry
  if (!entry) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.window,
    })
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetAt: now + config.window,
    }
  }

  // Entry expired
  if (entry.resetAt < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.window,
    })
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetAt: now + config.window,
    }
  }

  // Increment counter
  entry.count++
  const allowed = entry.count <= config.limit

  return {
    allowed,
    remaining: Math.max(0, config.limit - entry.count),
    resetAt: entry.resetAt,
  }
}

/**
 * Middleware wrapper for rate limiting
 */
export function createRateLimitMiddleware(config: RateLimitConfig) {
  return (request: NextRequest) => {
    const key = config.keyGenerator(request)
    const { allowed, remaining, resetAt } = checkRateLimit(key, {
      limit: config.limit,
      window: config.window,
    })

    const headers = new Headers({
      'X-RateLimit-Limit': config.limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(resetAt / 1000).toString(),
    })

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers,
        }
      )
    }

    return null // Continue to next middleware
  }
}

/**
 * Key generators for different strategies
 */
export const keyGenerators = {
  // Global limit (all users)
  global: () => 'global',

  // Per-user limit
  perUser: (request: NextRequest) => {
    const userId = request.headers.get('x-user-id') || 'anonymous'
    return `user:${userId}`
  },

  // Per-IP limit
  perIP: (request: NextRequest) => {
    const ip = request.headers.get('cf-connecting-ip') || 
               request.headers.get('x-forwarded-for') ||
               'unknown'
    return `ip:${ip}`
  },

  // Per-endpoint limit
  perEndpoint: (request: NextRequest, endpoint: string) => {
    const ip = request.headers.get('cf-connecting-ip') || 'unknown'
    return `endpoint:${endpoint}:${ip}`
  },

  // Per-user-per-endpoint limit
  perUserEndpoint: (request: NextRequest, endpoint: string) => {
    const userId = request.headers.get('x-user-id') || 'anonymous'
    return `${endpoint}:${userId}`
  },
}

/**
 * Reset rate limit for key (admin function)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key)
}

/**
 * Get rate limit stats (monitoring)
 */
export function getRateLimitStats() {
  return {
    totalKeys: rateLimitStore.size,
    entries: Array.from(rateLimitStore.entries()).map(([key, entry]) => ({
      key,
      count: entry.count,
      resetAt: new Date(entry.resetAt).toISOString(),
    })),
  }
}
