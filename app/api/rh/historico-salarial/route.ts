import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { historico_salarial, funcionarios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('auth_session')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await db
      .select()
      .from(historico_salarial)
      .where(eq(historico_salarial.userId, userId))

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching histórico salarial:', error)
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
      funcionario_id,
      salario_anterior,
      salario_novo,
      tipo_alteracao,
      motivo,
      data_vigencia,
    } = body

    // Atualizar salário do funcionário
    await db
      .update(funcionarios)
      .set({
        salario_base: parseFloat(salario_novo),
        updatedAt: new Date(),
      })
      .where(eq(funcionarios.id, funcionario_id))

    // Registrar no histórico
    const result = await db
      .insert(historico_salarial)
      .values({
        userId,
        funcionario_id,
        salario_anterior: parseFloat(salario_anterior),
        salario_novo: parseFloat(salario_novo),
        tipo_alteracao,
        motivo,
        data_vigencia: new Date(data_vigencia),
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating histórico salarial:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
