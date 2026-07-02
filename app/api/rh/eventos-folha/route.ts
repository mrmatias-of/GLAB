import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { eventos_folha } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('auth_session')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await db
      .select()
      .from(eventos_folha)
      .where(eq(eventos_folha.userId, userId))

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching eventos folha:', error)
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
      tipo_evento,
      descricao,
      data_evento,
      mes_referencia,
      ano_referencia,
      valor,
      horas,
    } = body

    const result = await db
      .insert(eventos_folha)
      .values({
        userId,
        funcionario_id,
        tipo_evento,
        descricao,
        data_evento: new Date(data_evento),
        mes_referencia,
        ano_referencia,
        valor: valor ? parseFloat(valor) : null,
        horas: horas ? parseFloat(horas) : null,
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating evento folha:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
