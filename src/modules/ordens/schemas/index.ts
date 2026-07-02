import { z } from 'zod'

export const CreateOrdemSchema = z.object({
  clienteId: z.number(),
  servicoId: z.number(),
  tecnicoId: z.number().optional(),
  descricao: z.string(),
  dataAgendada: z.string().datetime().optional(),
  prioridade: z.enum(['baixa', 'media', 'alta']).default('media'),
  valor: z.number().min(0).optional(),
  ativo: z.boolean().default(true),
})

export const UpdateOrdemSchema = CreateOrdemSchema.partial()

export const ListOrdemSchema = z.object({
  status: z.string().optional(),
  clienteId: z.number().optional(),
  tecnicoId: z.number().optional(),
})

export const UpdateOrdemStatusSchema = z.object({
  status: z.enum(['pendente', 'emaExecucao', 'concluida', 'cancelada']),
  observacao: z.string().optional(),
})

export type CreateOrdem = z.infer<typeof CreateOrdemSchema>
export type UpdateOrdem = z.infer<typeof UpdateOrdemSchema>
export type UpdateOrdemStatus = z.infer<typeof UpdateOrdemStatusSchema>
