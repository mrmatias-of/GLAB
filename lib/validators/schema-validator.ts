import { z, ZodSchema } from 'zod'
import { errorResponse } from '@/lib/middleware/api-response'

/**
 * Schema Validation Helper
 * Centralizes validation logic for API requests
 */

export interface ValidationError {
  field: string
  message: string
}

/**
 * Validate request data against schema
 * Returns validated data or error response
 */
export async function validateRequest<T>(
  data: any,
  schema: ZodSchema
): Promise<{ success: boolean; data?: T; errors?: ValidationError[] }> {
  try {
    const validated = await schema.parseAsync(data)
    return { success: true, data: validated as T }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.') || 'root',
        message: err.message,
      }))
      return { success: false, errors }
    }

    return {
      success: false,
      errors: [{ field: 'validation', message: 'Validation failed' }],
    }
  }
}

/**
 * Validate JSON body
 */
export async function validateBody<T>(
  request: Request,
  schema: ZodSchema
): Promise<{ success: boolean; data?: T; response?: Response }> {
  try {
    const body = await request.json()
    const validation = await validateRequest<T>(body, schema)

    if (!validation.success) {
      return {
        success: false,
        response: errorResponse(
          'Validation failed',
          400,
          validation.errors?.map(e => `${e.field}: ${e.message}`).join(', ')
        ),
      }
    }

    return { success: true, data: validation.data }
  } catch (error) {
    return {
      success: false,
      response: errorResponse('Invalid JSON', 400),
    }
  }
}

/**
 * Validate query parameters
 */
export async function validateQuery<T>(
  url: string,
  schema: ZodSchema
): Promise<{ success: boolean; data?: T; response?: Response }> {
  try {
    const urlObj = new URL(url)
    const params = Object.fromEntries(urlObj.searchParams)
    const validation = await validateRequest<T>(params, schema)

    if (!validation.success) {
      return {
        success: false,
        response: errorResponse(
          'Validation failed',
          400,
          validation.errors?.map(e => `${e.field}: ${e.message}`).join(', ')
        ),
      }
    }

    return { success: true, data: validation.data }
  } catch (error) {
    return {
      success: false,
      response: errorResponse('Invalid query parameters', 400),
    }
  }
}

/**
 * Validate URL params
 */
export async function validateParams<T>(
  params: any,
  schema: ZodSchema
): Promise<{ success: boolean; data?: T; response?: Response }> {
  const validation = await validateRequest<T>(params, schema)

  if (!validation.success) {
    return {
      success: false,
      response: errorResponse(
        'Validation failed',
        400,
        validation.errors?.map(e => `${e.field}: ${e.message}`).join(', ')
      ),
    }
  }

  return { success: true, data: validation.data }
}
