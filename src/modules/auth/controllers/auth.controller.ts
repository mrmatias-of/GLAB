import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '../services/auth.service'
import { LoginSchema, SignUpSchema, ResetPasswordSchema } from '../schemas'
import { AppError } from '@/src/shared/errors/app.error'
import type { ApiResponse } from '@/src/shared/types'

const authService = new AuthService()

/**
 * POST /api/auth/login
 */
export async function handleLogin(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json()
    const validated = LoginSchema.parse(body)
    
    const result = await authService.login(validated)
    
    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/auth/signup
 */
export async function handleSignUp(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json()
    const validated = SignUpSchema.parse(body)
    
    // Get tenant ID from header or context
    const tenantId = request.headers.get('x-tenant-id') || 'default'
    
    const result = await authService.signUp(validated, tenantId)
    
    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Erro ao criar conta' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/auth/forgot-password
 */
export async function handleForgotPassword(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json()
    const validated = ResetPasswordSchema.parse(body)
    
    const result = await authService.requestPasswordReset(validated)
    
    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Erro ao solicitar reset de senha' },
      { status: 500 }
    )
  }
}
