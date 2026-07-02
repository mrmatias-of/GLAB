import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contracheques, funcionarios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { calcularFolhaPagamento } from '@/lib/rh/salary-calculator'

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('auth_session')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { mes, ano } = body

    if (!mes || !ano) {
      return NextResponse.json(
        { error: 'Mês e ano são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar todos os funcionários ativos
    const funcs = await db
      .select()
      .from(funcionarios)
      .where(eq(funcionarios.userId, userId))

    const contrachequeGerados: any[] = []
    const erros: any[] = []

    // Gerar contracheque para cada funcionário
    for (const func of funcs) {
      try {
        // Verificar se já existe contracheque para este mês
        const existe = await db
          .select()
          .from(contracheques)
          .where(
            (col) => 
              col.userId === userId &&
              col.funcionario_id === func.id &&
              col.mes === mes &&
              col.ano === ano
          )

        if (existe.length > 0) {
          erros.push({
            funcionario_id: func.id,
            mensagem: `Contracheque já existe para ${mes}/${ano}`,
          })
          continue
        }

        // Calcular salário
        const calculo = calcularFolhaPagamento({
          salarioBase: Number(func.salario_base),
        })

        // Salvar contracheque
        const result = await db
          .insert(contracheques)
          .values({
            userId,
            funcionario_id: func.id,
            mes,
            ano,
            salario_base: calculo.salarioBase,
            horas_extras_50: 0,
            horas_extras_100: 0,
            total_proventos: calculo.totalProventos,
            inss: calculo.inss,
            irpf: calculo.irpf,
            fgts: calculo.fgts,
            total_descontos: calculo.totalDescontos,
            valor_liquido: calculo.valorLiquido,
            status_pagamento: 'pendente',
          })
          .returning()

        contrachequeGerados.push(result[0])
      } catch (erro: any) {
        erros.push({
          funcionario_id: func.id,
          mensagem: erro.message,
        })
      }
    }

    return NextResponse.json({
      gerados: contrachequeGerados.length,
      contracheques: contrachequeGerados,
      erros,
    })
  } catch (error) {
    console.error('Error generating folha pagamento:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
