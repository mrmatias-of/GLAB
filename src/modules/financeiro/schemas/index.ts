import { z } from 'zod'
import {
  IdSchema,
  PaginationSchema,
  PaymentStatusSchema,
  DateSchema,
  CurrencySchema,
} from '@/src/shared/schemas/common.schemas'

/**
 * Financeiro (Financial) Validation Schemas
 */

const TransactionTypeSchema = z.enum(['receita', 'despesa', 'transferencia'])

export const CreateTransacaoSchema = z.object({
  tipo: TransactionTypeSchema,
  descricao: z.string().min(5).max(255),
  valor: CurrencySchema.positive(),
  data: DateSchema,
  status: PaymentStatusSchema.default('pendente'),
  categoria: z.string().min(1).max(100).optional(),
  referencia: z.string().max(100).optional(),
})

export type CreateTransacaoInput = z.infer<typeof CreateTransacaoSchema>

export const UpdateTransacaoSchema = CreateTransacaoSchema.partial()

export type UpdateTransacaoInput = z.infer<typeof UpdateTransacaoSchema>

export const QueryFinanceiroSchema = PaginationSchema.extend({
  tipo: TransactionTypeSchema.optional(),
  status: PaymentStatusSchema.optional(),
  categoria: z.string().optional(),
  dataInicio: DateSchema.optional(),
  dataFim: DateSchema.optional(),
})

export type QueryFinanceiroInput = z.infer<typeof QueryFinanceiroSchema>

export const TransacaoIdSchema = z.object({
  id: IdSchema,
})

export type TransacaoIdInput = z.infer<typeof TransacaoIdSchema>
