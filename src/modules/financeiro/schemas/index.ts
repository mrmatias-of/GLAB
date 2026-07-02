import { z } from 'zod'

export const CreateFinanceiroSchema = z.object({
  tipo: z.enum(['receita', 'despesa', 'comissao']),
  descricao: z.string(),
  valor: z.number().min(0),
  data: z.string().date(),
  status: z.enum(['pendente', 'pago', 'cancelado']).default('pendente'),
  clienteId: z.number().optional(),
  referencia: z.string().optional(),
})

export const UpdateFinanceiroSchema = CreateFinanceiroSchema.partial()

export const ListFinanceiroSchema = z.object({
  tipo: z.enum(['receita', 'despesa', 'comissao']).optional(),
  status: z.enum(['pendente', 'pago', 'cancelado']).optional(),
  dataInicio: z.string().date().optional(),
  dataFim: z.string().date().optional(),
})

export const CashFlowSchema = z.object({
  dataInicio: z.string().date(),
  dataFim: z.string().date(),
})

export type CreateFinanceiro = z.infer<typeof CreateFinanceiroSchema>
export type UpdateFinanceiro = z.infer<typeof UpdateFinanceiroSchema>
export type ListFinanceiro = z.infer<typeof ListFinanceiroSchema>
