import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { banco_horas } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('auth_session')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await db
      .select()
      .from(banco_horas)
      .where(eq(banco_horas.userId, userId))

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching banco de horas:', error)
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
      mes_ano,
      saldo_anterior,
      horas_trabalhadas,
      horas_devidas,
      horas_gozadas,
      faltas_justificadas,
      faltas_injustificadas,
    } = body

    // Calcular saldo atual
    const saldoAtual = parseFloat(saldo_anterior || 0) + 
                       parseFloat(horas_trabalhadas || 0) + 
                       parseFloat(horas_devidas || 0) - 
                       parseFloat(horas_gozadas || 0) - 
                       parseFloat(faltas_injustificadas || 0)

    const result = await db
      .insert(banco_horas)
      .values({
        userId,
        funcionario_id,
        mes_ano,
        saldo_anterior: (saldo_anterior || 0).toString(),
        horas_trabalhadas: (horas_trabalhadas || 0).toString(),
        horas_devidas: (horas_devidas || 0).toString(),
        horas_gozadas: (horas_gozadas || 0).toString(),
        faltas_justificadas: (faltas_justificadas || 0).toString(),
        faltas_injustificadas: (faltas_injustificadas || 0).toString(),
        saldo_atual: saldoAtual.toString(),
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating banco de horas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
