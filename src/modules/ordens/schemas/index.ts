import { z } from 'zod'
import {
  IdSchema,
  PaginationSchema,
  OrderStatusSchema,
  DateSchema,
  CurrencySchema,
} from '@/src/shared/schemas/common.schemas'

/**
 * Ordens (Service Orders) Validation Schemas
 */

export const CreateOrdemSchema = z.object({
  cliente_id: IdSchema,
  tecnico_id: IdSchema,
  descricao: z.string().min(10).max(1000),
  status: OrderStatusSchema.default('novo'),
  data_inicio: DateSchema.optional(),
  data_conclusao: DateSchema.optional(),
  valor_total: CurrencySchema,
  notas: z.string().max(1000).optional(),
})

export type CreateOrdemInput = z.infer<typeof CreateOrdemSchema>

export const UpdateOrdemSchema = CreateOrdemSchema.partial()

export type UpdateOrdemInput = z.infer<typeof UpdateOrdemSchema>

export const QueryOrdemSchema = PaginationSchema.extend({
  status: OrderStatusSchema.optional(),
  cliente_id: IdSchema.optional(),
  tecnico_id: IdSchema.optional(),
})

export type QueryOrdemInput = z.infer<typeof QueryOrdemSchema>

export const OrdemIdSchema = z.object({
  id: IdSchema,
})

export type OrdemIdInput = z.infer<typeof OrdemIdSchema>
