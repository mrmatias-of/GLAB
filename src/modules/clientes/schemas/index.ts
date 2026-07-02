import { z } from 'zod'
import {
  IdSchema,
  NameSchema,
  EmailSchema,
  PhoneSchema,
  StatusSchema,
  PaginationSchema,
  CurrencySchema,
} from '@/src/shared/schemas/common.schemas'

/**
 * Cliente (CRM) Validation Schemas
 */

// Create Cliente
export const CreateClienteSchema = z.object({
  nome: NameSchema,
  email: EmailSchema,
  telefone: PhoneSchema,
  empresa: z.string().min(1).max(255).optional(),
  cidade: z.string().min(1).max(255).optional(),
  estado: z.string().length(2).uppercase().optional(),
  cep: z.string().regex(/^\d{5}-?\d{3}$/).optional(),
  endereco: z.string().max(255).optional(),
  status: StatusSchema.default('ativo'),
  satisfacao: z.number().min(1).max(5).optional(),
  valor_acumulado: CurrencySchema.default(0),
})

export type CreateClienteInput = z.infer<typeof CreateClienteSchema>

// Update Cliente
export const UpdateClienteSchema = CreateClienteSchema.partial()

export type UpdateClienteInput = z.infer<typeof UpdateClienteSchema>

// Query Cliente
export const QueryClienteSchema = PaginationSchema.extend({
  ativo: z.boolean().optional(),
  cidade: z.string().optional(),
  status: StatusSchema.optional(),
})

export type QueryClienteInput = z.infer<typeof QueryClienteSchema>

// Cliente ID param
export const ClienteIdSchema = z.object({
  id: IdSchema,
})

export type ClienteIdInput = z.infer<typeof ClienteIdSchema>

// Get Cliente (query string)
export const GetClienteSchema = z.object({
  ativo: z.string().transform(v => v === 'true').optional(),
  cidade: z.string().optional(),
})

export type GetClienteInput = z.infer<typeof GetClienteSchema>
