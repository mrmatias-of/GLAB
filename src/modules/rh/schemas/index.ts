import { z } from 'zod'

export const CreateFuncionarioSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  telefone: z.string(),
  cpf: z.string(),
  dataAdmissao: z.string().date(),
  cargo: z.string(),
  departamento: z.string(),
  salario: z.number().min(0),
  ativo: z.boolean().default(true),
})

export const UpdateFuncionarioSchema = CreateFuncionarioSchema.partial()

export const BancoHorasSchema = z.object({
  funcionarioId: z.number(),
  horas: z.number(),
  tipo: z.enum(['adicionado', 'utilizado']),
  motivo: z.string().optional(),
})

export const ContrachequeSchema = z.object({
  funcionarioId: z.number(),
  mes: z.number().min(1).max(12),
  ano: z.number().min(2000),
  salarioBruto: z.number().min(0),
  descontos: z.number().default(0),
  adicionais: z.number().default(0),
  salarioLiquido: z.number().min(0),
})

export type CreateFuncionario = z.infer<typeof CreateFuncionarioSchema>
export type UpdateFuncionario = z.infer<typeof UpdateFuncionarioSchema>
export type BancoHoras = z.infer<typeof BancoHorasSchema>
export type Contracheque = z.infer<typeof ContrachequeSchema>
