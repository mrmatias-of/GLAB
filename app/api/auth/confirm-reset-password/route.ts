import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user, passwordResets, account } from '@/lib/db/schema'
import { sendEmail, getPasswordChangedEmailTemplate } from '@/lib/email/locaweb-sender'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { eq, and } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, email, newPassword } = body

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { error: 'Token, email e nova senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Hash do token fornecido
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Buscar registro de reset válido
    const resetRecord = await db.query.passwordResets.findFirst({
      where: (table, { eq }) => eq(table.token, hashedToken),
    })

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Link inválido ou expirado' },
        { status: 401 }
      )
    }

    // Verificar se expirou (24 horas)
    const now = new Date()
    if (new Date(resetRecord.expiresAt) < now) {
      return NextResponse.json(
        { error: 'Link expirado. Solicite um novo link de recuperação' },
        { status: 401 }
      )
    }

    // Verificar se email corresponde
    const userData = await db.query.user.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    })

    if (!userData || userData.id !== resetRecord.userId) {
      return NextResponse.json(
        { error: 'Email não corresponde ao link' },
        { status: 401 }
      )
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Atualizar senha no account
    await db
      .update(account)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(account.userId, userData.id))

    // Deletar o token de reset usado
    await db.delete(passwordResets).where(eq(passwordResets.id, resetRecord.id))

    // Enviar email de confirmação
    try {
      await sendEmail({
        to: email,
        subject: 'Senha Alterada com Sucesso - G•Lab Cursos',
        html: getPasswordChangedEmailTemplate(userData.name || 'Usuário'),
      })
    } catch (emailError) {
      console.error('Erro ao enviar email de confirmação:', emailError)
      // Continua mesmo se email falhar
    }

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso! Você pode fazer login agora.',
    })
  } catch (error) {
    console.error('Erro ao redefinir senha:', error)
    return NextResponse.json(
      { error: 'Erro ao redefinir senha' },
      { status: 500 }
    )
  }
}
