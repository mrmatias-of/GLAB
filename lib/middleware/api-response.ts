import { NextResponse } from 'next/server'

/**
 * Standardized API Response Format
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

/**
 * Success response
 */
export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>,
    { status }
  )
}

/**
 * Error response
 */
export function errorResponse(error: string, status = 400, message?: string) {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
      timestamp: new Date().toISOString(),
    } as ApiResponse,
    { status }
  )
}

/**
 * Unauthorized
 */
export function unauthorizedResponse() {
  return errorResponse('Unauthorized', 401, 'Authentication required')
}

/**
 * Forbidden
 */
export function forbiddenResponse(reason?: string) {
  return errorResponse('Forbidden', 403, reason || 'Access denied')
}

/**
 * Not found
 */
export function notFoundResponse(resource = 'Resource') {
  return errorResponse('Not found', 404, `${resource} not found`)
}

/**
 * Bad request
 */
export function badRequestResponse(message?: string) {
  return errorResponse('Bad request', 400, message)
}

/**
 * Internal server error
 */
export function internalErrorResponse(message = 'Internal server error') {
  return errorResponse('Internal server error', 500, message)
}

/**
 * Rate limit exceeded
 */
export function rateLimitResponse() {
  return errorResponse('Rate limit exceeded', 429, 'Too many requests. Please try again later.')
}
