import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contracheques, funcionarios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { calcularFolhaPagamento } from '@/lib/rh/salary-calculator'

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('auth_session')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await db
      .select()
      .from(contracheques)
      .where(eq(contracheques.userId, userId))

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching contracheques:', error)
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
      mes,
      ano,
      horasExtras50,
      horasExtras100,
      adicionalNoturno,
      adicionalInsalubridade,
      adicionalPericulosidade,
      bonus,
      comissao,
      adiantamento,
    } = body

    // Buscar dados do funcionário
    const funcionario = await db
      .select()
      .from(funcionarios)
      .where(eq(funcionarios.id, funcionario_id))

    if (!funcionario.length) {
      return NextResponse.json({ error: 'Funcionário não encontrado' }, { status: 404 })
    }

    const func = funcionario[0]

    // Calcular folha de pagamento
    const calculo = calcularFolhaPagamento({
      salarioBase: Number(func.salario_base),
      horasExtras50: horasExtras50 || 0,
      horasExtras100: horasExtras100 || 0,
      adicionalNoturno: adicionalNoturno || 0,
      adicionalInsalubridade: adicionalInsalubridade || 0,
      adicionalPericulosidade: adicionalPericulosidade || 0,
      bonus: bonus || 0,
      comissao: comissao || 0,
      adiantamento: adiantamento || 0,
    })

    // Salvar contracheque
    const result = await db
      .insert(contracheques)
      .values({
        userId,
        funcionario_id,
        mes,
        ano,
        salario_base: calculo.salarioBase,
        horas_extras_50: calculo.horasExtras50,
        horas_extras_100: calculo.horasExtras100,
        adicional_noturno: calculo.adicionalNoturno,
        adicional_insalubridade: calculo.adicionalInsalubridade,
        adicional_periculosidade: calculo.adicionalPericulosidade,
        bônus: calculo.bonus,
        comissao: calculo.comissao,
        total_proventos: calculo.totalProventos,
        inss: calculo.inss,
        irpf: calculo.irpf,
        fgts: calculo.fgts,
        total_descontos: calculo.totalDescontos,
        valor_liquido: calculo.valorLiquido,
        status_pagamento: 'pendente',
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating contracheque:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
