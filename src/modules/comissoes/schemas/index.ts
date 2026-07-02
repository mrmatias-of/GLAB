import { z } from 'zod'

export const CreateComissaoSchema = z.object({
  funcionarioId: z.number(),
  vendedorId: z.number().optional(),
  valor: z.number().min(0),
  percentual: z.number().min(0).max(100),
  tipo: z.enum(['venda', 'servico', 'bonus']),
  referencia: z.string().optional(),
  mes: z.number().min(1).max(12),
  ano: z.number().min(2000),
})

export const ListComissaoSchema = z.object({
  mes: z.number().min(1).max(12).optional(),
  ano: z.number().min(2000).optional(),
  funcionarioId: z.number().optional(),
})

export type CreateComissao = z.infer<typeof CreateComissaoSchema>
export type ListComissao = z.infer<typeof ListComissaoSchema>
