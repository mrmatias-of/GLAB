import { z } from 'zod'

export const CreateEstoqueSchema = z.object({
  nome: z.string().min(3),
  descricao: z.string().optional(),
  sku: z.string().optional(),
  categoria: z.string(),
  quantidade: z.number().min(0),
  preco: z.number().min(0),
  estoqueBaixoAlerta: z.number().min(0).optional(),
  fornecedor: z.string().optional(),
  ativo: z.boolean().default(true),
})

export const UpdateEstoqueSchema = CreateEstoqueSchema.partial()

export const ListEstoqueSchema = z.object({
  categoria: z.string().optional(),
  ativo: z.boolean().optional(),
  estoqueBaixo: z.boolean().optional(),
})

export const MovimentacaoEstoqueSchema = z.object({
  tipo: z.enum(['entrada', 'saida', 'ajuste']),
  quantidade: z.number().min(1),
  motivo: z.string().optional(),
  referencia: z.string().optional(),
})

export type CreateEstoque = z.infer<typeof CreateEstoqueSchema>
export type UpdateEstoque = z.infer<typeof UpdateEstoqueSchema>
export type MovimentacaoEstoque = z.infer<typeof MovimentacaoEstoqueSchema>
