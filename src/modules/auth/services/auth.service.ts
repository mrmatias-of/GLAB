import { db } from '@/lib/db'
import { user, account } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { sendEmail, getWelcomeEmailTemplate, getResetPasswordEmailTemplate } from '@/lib/email/locaweb-sender'
import { AppError } from '@/src/shared/errors/app.error'
import type { LoginInput, SignUpInput, ResetPasswordInput } from '../schemas'

/**
 * Auth Service
 * Lógica de autenticação, sign-up, password reset
 */
export class AuthService {
  /**
   * Login - valida credenciais
   */
  async login(input: LoginInput) {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, input.email),
    })

    if (!existingUser) {
      throw AppError.NotFound('Usuário')
    }

    // Find account com credentials
    const userAccount = await db.query.account.findFirst({
      where: eq(account.userId, existingUser.id),
    })

    if (!userAccount || !userAccount.password) {
      throw AppError.Unauthorized()
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(input.password, userAccount.password)
    if (!passwordMatch) {
      throw AppError.Unauthorized()
    }

    return {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
    }
  }

  /**
   * Sign Up - cria novo usuário
   */
  async signUp(input: SignUpInput, tenantId: string) {
    // Verificar se email já existe
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, input.email),
    })

    if (existingUser) {
      throw AppError.BadRequest('Email já registrado')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10)
    const userId = uuidv4()

    // Criar usuário
    await db.insert(user).values({
      id: userId,
      tenantId,
      name: input.name,
      email: input.email,
      emailVerified: true,
    })

    // Criar account com credenciais
    await db.insert(account).values({
      id: uuidv4(),
      tenantId,
      userId,
      providerId: 'credential',
      accountId: input.email,
      password: hashedPassword,
    })

    // Enviar email boas-vindas
    try {
      await sendEmail({
        to: input.email,
        subject: 'Bem-vindo ao GLAB ERP',
        html: getWelcomeEmailTemplate(input.name, input.email),
      })
    } catch (err) {
      console.error('Erro ao enviar email:', err)
    }

    return {
      id: userId,
      email: input.email,
      name: input.name,
      message: 'Conta criada com sucesso',
    }
  }

  /**
   * Request Password Reset
   */
  async requestPasswordReset(input: ResetPasswordInput) {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, input.email),
    })

    if (!existingUser) {
      // Não revelar se email existe ou não por segurança
      return { message: 'Se o email existe, um link foi enviado' }
    }

    // Gerar token
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas

    // Salvar token
    await db.insert(passwordResets).values({
      userId: existingUser.id,
      token,
      expiresAt,
    })

    // Enviar email
    try {
      await sendEmail({
        to: existingUser.email,
        subject: 'Redefinir senha - GLAB ERP',
        html: getResetPasswordEmailTemplate(existingUser.name, token),
      })
    } catch (err) {
      console.error('Erro ao enviar email:', err)
    }

    return { message: 'Se o email existe, um link foi enviado' }
  }
}

import { passwordResets } from '@/lib/db/schema'
