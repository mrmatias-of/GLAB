import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user, account } from '@/lib/db/schema'
import { sendEmail, getWelcomeEmailTemplate } from '@/lib/email/locaweb-sender'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validação
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingUser = await db.query.user.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = uuidv4()

    // Criar novo usuário
    await db.insert(user).values({
      id: userId,
      email,
      name,
      emailVerified: true,
    })

    // Criar account com credenciais
    await db.insert(account).values({
      id: uuidv4(),
      userId,
      providerId: 'credential',
      accountId: email,
      password: hashedPassword,
    })

    // Enviar email de boas-vindas
    try {
      await sendEmail({
        to: email,
        subject: 'Bem-vindo ao G•Lab Cursos',
        html: getWelcomeEmailTemplate(name, email),
      })
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError)
      // Continua mesmo se email falhar
    }

    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso! Faça login para continuar.',
      user: {
        id: userId,
        email,
        name,
      },
    })
  } catch (error) {
    console.error('Erro ao criar conta:', error)
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    )
  }
}
