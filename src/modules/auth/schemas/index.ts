import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const SignUpSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})

export const ResetPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export const ConfirmResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token obrigatório'),
  newPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})

export type LoginInput = z.infer<typeof LoginSchema>
export type SignUpInput = z.infer<typeof SignUpSchema>
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>
export type ConfirmResetPasswordInput = z.infer<typeof ConfirmResetPasswordSchema>
