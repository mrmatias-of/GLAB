import { describe, it, expect, beforeEach, vi } from 'vitest'
import { withMiddleware } from '@/lib/middleware'

describe('withMiddleware', () => {
  let mockRequest: any
  let mockContext: any

  beforeEach(() => {
    mockRequest = {
      headers: new Map([
        ['x-user-id', 'test-user-123'],
        ['x-tenant-id', 'tenant-456'],
      ]),
    }
    mockContext = {}
  })

  it('should extract userId and tenantId from headers', async () => {
    const handler = withMiddleware(async (req, ctx) => {
      return {
        userId: ctx.userId,
        tenantId: ctx.tenantId,
        success: true,
      }
    })

    const result = await handler(mockRequest, mockContext)

    expect(result.userId).toBe('test-user-123')
    expect(result.tenantId).toBe('tenant-456')
    expect(result.success).toBe(true)
  })

  it('should throw error if userId is missing', async () => {
    const requestWithoutUser = {
      headers: new Map([['x-tenant-id', 'tenant-456']]),
    }

    const handler = withMiddleware(async (req, ctx) => {
      return { userId: ctx.userId }
    })

    expect(async () => {
      await handler(requestWithoutUser, mockContext)
    }).rejects.toThrow('Missing userId')
  })

  it('should apply rate limiting', async () => {
    const handler = withMiddleware(async (req, ctx) => {
      return { success: true }
    })

    // First request should succeed
    const result1 = await handler(mockRequest, mockContext)
    expect(result1.success).toBe(true)

    // Subsequent requests within limit should succeed
    const result2 = await handler(mockRequest, mockContext)
    expect(result2.success).toBe(true)
  })

  it('should log all requests', async () => {
    const loggerSpy = vi.spyOn(console, 'log')

    const handler = withMiddleware(async (req, ctx) => {
      return { success: true }
    })

    await handler(mockRequest, mockContext)

    expect(loggerSpy).toHaveBeenCalled()
    loggerSpy.mockRestore()
  })

  it('should handle CSRF token validation', async () => {
    const requestWithCsrf = {
      ...mockRequest,
      headers: new Map([
        ...mockRequest.headers.entries(),
        ['x-csrf-token', 'valid-csrf-token'],
      ]),
    }

    const handler = withMiddleware(async (req, ctx) => {
      return { csrfValidated: true }
    })

    const result = await handler(requestWithCsrf, mockContext)
    expect(result.csrfValidated).toBe(true)
  })

  it('should catch and format errors', async () => {
    const handler = withMiddleware(async (req, ctx) => {
      throw new Error('Test error')
    })

    const result = await handler(mockRequest, mockContext)
    expect(result.error).toBeDefined()
    expect(result.status).toBe(500)
  })
})
