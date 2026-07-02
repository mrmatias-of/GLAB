/**
 * Auth Module - Barrel Exports
 * Central entry point for auth module (DDD Pattern)
 */

// Configuration
export { auth, createAuthConfig } from './config'

// Types
export * from './types'

// Schemas (Zod Validation)
export * from './schemas'

// Repository
export { AuthRepository } from './repositories/auth.repository'

// Services
export * from './services/auth.service'

// Controllers
export * from './controllers/auth.controller'
