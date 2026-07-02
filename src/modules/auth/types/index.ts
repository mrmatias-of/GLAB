/**
 * Auth Module Types
 */

export interface AuthUser {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  user: AuthUser
  expiresAt: number
  token: string
  ipAddress?: string
  userAgent?: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface ResetPasswordConfirm {
  token: string
  newPassword: string
}

export interface AuthError {
  code: string
  message: string
  status: number
}
