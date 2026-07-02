import { z } from 'zod'

export const CreateClienteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido').optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  documento: z.string().optional(),
  tipo: z.enum(['PF', 'PJ']).default('PF'),
  ativo: z.boolean().default(true),
})

export const UpdateClienteSchema = CreateClienteSchema.partial()

export const ListClientesSchema = z.object({
  ativo: z.boolean().optional(),
  cidade: z.string().optional(),
  tipo: z.enum(['PF', 'PJ']).optional(),
  search: z.string().optional(),
})

export type CreateCliente = z.infer<typeof CreateClienteSchema>
export type UpdateCliente = z.infer<typeof UpdateClienteSchema>
export type ListClientes = z.infer<typeof ListClientesSchema>
