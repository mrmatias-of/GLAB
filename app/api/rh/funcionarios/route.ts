import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { funcionarios } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('auth_session')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await db
      .select()
      .from(funcionarios)
      .where(eq(funcionarios.userId, userId))

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching funcionários:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('auth_session')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      nome,
      email,
      cpf,
      cargo,
      salario_base,
      data_admissao,
      tipo_contrato,
      regime_jornada,
      departamento,
      telefone,
      endereco,
      cidade,
      estado,
      cep,
    } = body

    if (!nome || !cpf || !cargo || !salario_base) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await db
      .insert(funcionarios)
      .values({
        userId,
        nome,
        email,
        cpf,
        cargo,
        salario_base: salario_base.toString(),
        data_admissao: new Date(data_admissao),
        tipo_contrato: tipo_contrato || 'CLT',
        regime_jornada: regime_jornada || 'normal',
        departamento,
        telefone,
        endereco,
        cidade,
        estado,
        cep,
        status: 'ativo',
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating funcionário:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
