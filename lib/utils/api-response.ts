import type { ApiResponse, ApiError } from '@/lib/types/common.types'
import { NextResponse } from 'next/server'

export class AppError extends Error {
  constructor(
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    message: string = 'An error occurred',
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function success<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message: message || 'Operation successful',
    statusCode: 200,
  }
}

export function error(
  statusCode: number = 500,
  message: string = 'Internal Server Error',
  code: string = 'INTERNAL_ERROR',
  details?: Record<string, any>
): ApiResponse {
  return {
    success: false,
    error: message,
    statusCode,
  }
}

export function apiResponse<T>(
  data: T | null,
  statusCode: number = 200,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: statusCode >= 200 && statusCode < 300,
      data,
      message,
      statusCode,
    },
    { status: statusCode }
  )
}

export function apiError(
  statusCode: number = 500,
  message: string = 'Internal Server Error',
  code: string = 'INTERNAL_ERROR'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      statusCode,
    },
    { status: statusCode }
  )
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('[API Error]:', error)

  if (error instanceof AppError) {
    return apiError(error.statusCode, error.message, error.code)
  }

  if (error instanceof Error) {
    return apiError(500, error.message)
  }

  return apiError(500, 'Unknown error occurred')
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
}
