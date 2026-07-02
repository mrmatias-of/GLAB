/**
 * Auth Module Types
 */

export interface SignUpRequest {
  email: string
  password: string
  name: string
}

export interface SignInRequest {
  email: string
  password: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface ConfirmResetRequest {
  token: string
  newPassword: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: {
    id: string
    email: string
    name: string
  }
  error?: string
}

export interface UserSession {
  userId: string
  email: string
  tenantId: string
  sessionToken: string
}
