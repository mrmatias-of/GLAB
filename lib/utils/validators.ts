import { z } from 'zod'

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, '')
  if (cpf.length !== 11) return false

  let sum = 0
  let remainder

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.substring(9, 10))) return false

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.substring(10, 11))) return false

  return true
}

export const validateCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/\D/g, '')
  if (cnpj.length !== 14) return false

  let size = cnpj.length - 2
  let numbers = cnpj.substring(0, size)
  const digits = cnpj.substring(size)
  let sum = 0
  let pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) as any * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false

  size = size + 1
  numbers = cnpj.substring(0, size)
  sum = 0
  pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) as any * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(1))) return false

  return true
}

// Zod schemas para validação de dados
export const createClientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  cpf: z.string().optional().refine((val) => !val || validateCPF(val), 'CPF inválido'),
  cnpj: z.string().optional().refine((val) => !val || validateCNPJ(val), 'CNPJ inválido'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
})

export const createTechnicianSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
})

export const createOrderSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  equipmentDescription: z.string().min(5, 'Descrição do equipamento obrigatória'),
  issue: z.string().min(5, 'Descrição do problema obrigatória'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['open', 'assigned', 'in_progress', 'on_hold', 'completed']).default('open'),
})

export const createFinancialEntrySchema = z.object({
  description: z.string().min(3, 'Descrição obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(3, 'Categoria obrigatória'),
  dueDate: z.date().optional(),
  paid: z.boolean().default(false),
})
