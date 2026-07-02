import { z } from 'zod'
import {
  IdSchema,
  NameSchema,
  PaginationSchema,
  CurrencySchema,
} from '@/src/shared/schemas/common.schemas'

/**
 * Estoque (Inventory) Validation Schemas
 */

export const CreateEstoqueSchema = z.object({
  nome: NameSchema,
  sku: z.string().min(1).max(50),
  descricao: z.string().max(500).optional(),
  quantidade_atual: z.number().int().nonnegative(),
  quantidade_minima: z.number().int().nonnegative(),
  preco_unitario: CurrencySchema,
  categoria: z.string().min(1).max(100).optional(),
  localizacao: z.string().max(255).optional(),
})

export type CreateEstoqueInput = z.infer<typeof CreateEstoqueSchema>

export const UpdateEstoqueSchema = CreateEstoqueSchema.partial()

export type UpdateEstoqueInput = z.infer<typeof UpdateEstoqueSchema>

export const QueryEstoqueSchema = PaginationSchema.extend({
  categoria: z.string().optional(),
  disponivel: z.boolean().optional(),
})

export type QueryEstoqueInput = z.infer<typeof QueryEstoqueSchema>

export const EstoqueIdSchema = z.object({
  id: IdSchema,
})

export type EstoqueIdInput = z.infer<typeof EstoqueIdSchema>
