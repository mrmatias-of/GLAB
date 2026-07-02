import { z } from 'zod'

/**
 * Common Zod Schemas shared across modules
 */

// ID Schemas
export const IdSchema = z.number().int().positive()
export const StringIdSchema = z.string().min(1)
export const UUIDSchema = z.string().uuid()

// Pagination
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Date schemas
export const DateSchema = z.string().datetime().or(z.date())
export const DateRangeSchema = z.object({
  startDate: DateSchema,
  endDate: DateSchema,
})

// Email
export const EmailSchema = z.string().email().toLowerCase().trim()

// Strings
export const NameSchema = z.string().min(2).max(255).trim()
export const SlugSchema = z.string().min(1).max(100).regex(/^[a-z0-9-]+$/)
export const PhoneSchema = z.string().regex(/^\+?[\d\s\-()]+$/).optional()
export const URLSchema = z.string().url().optional()

// Currency
export const CurrencySchema = z.number().nonnegative()
export const PercentageSchema = z.number().min(0).max(100)

// Status enums
export const StatusSchema = z.enum(['ativo', 'inativo', 'suspenso'])
export const PaymentStatusSchema = z.enum(['pendente', 'pago', 'cancelado', 'atrasado'])
export const OrderStatusSchema = z.enum(['novo', 'confirmado', 'em_progresso', 'concluido', 'cancelado'])

// Tenant
export const TenantIdSchema = z.string().min(1)

// Common responses
export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
  timestamp: z.string().datetime(),
})

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
  timestamp: z.string().datetime(),
})
