import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user, passwordResets } from '@/lib/db/schema'
import { sendEmail, getResetPasswordEmailTemplate } from '@/lib/email/locaweb-sender'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se email existe
    const userData = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    })

    if (!userData) {
      // Não retornar que email não existe por segurança
      return NextResponse.json({
        success: true,
        message: 'Se o email existe, um link de reset será enviado.',
      })
    }

    // Gerar token único
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas

    // Criar tabela de resets se não existir (será criada no schema)
    // Por enquanto, vamos armazenar no banco
    try {
      await db.insert(passwordResets).values({
        userId: userData.id,
        token: hashedToken,
        expiresAt,
      })
    } catch (err) {
      console.error('Erro ao salvar token:', err)
    }

    // Montar link de reset
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}&email=${email}`

    // Enviar email
    try {
      await sendEmail({
        to: email,
        subject: 'Redefinir Senha - G•Lab Cursos',
        html: getResetPasswordEmailTemplate(userData.name || 'Usuário', resetLink),
      })
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Se o email existe, um link de reset será enviado.',
    })
  } catch (error) {
    console.error('Erro ao processar reset:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}
