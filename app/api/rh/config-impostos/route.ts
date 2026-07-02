import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { config_impostos } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('auth_session')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Buscar configuração do ano atual
    const anoAtual = new Date().getFullYear()
    const data = await db
      .select()
      .from(config_impostos)
      .where(eq(config_impostos.userId, userId))

    // Se não existe, retornar valores padrão de 2024
    if (!data.length) {
      return NextResponse.json({
        ano: anoAtual,
        inssAliquota: 8,
        inssMaximo: 1751.15,
        fgtsAliquota: 8,
        irpfFaixas: [
          { ate: 2826.65, aliquota: 0, deducao: 0 },
          { ate: 3751.05, aliquota: 7.5, deducao: 211.95 },
          { ate: 4664.68, aliquota: 15, deducao: 528.94 },
          { ate: 5555.48, aliquota: 22.5, deducao: 990.55 },
          { ate: 999999, aliquota: 27.5, deducao: 1613.03 },
        ],
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching config impostos:', error)
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
    const { ano, ...config } = body

    const result = await db
      .insert(config_impostos)
      .values({
        userId,
        ano,
        inss_aliquota_base: config.inss_aliquota_base || 8,
        inss_maximo_mensal: config.inss_maximo_mensal || 1751.15,
        irpf_faixa_1_ate: config.irpf_faixa_1_ate || 2826.65,
        irpf_faixa_1_aliquota: config.irpf_faixa_1_aliquota || 0,
        irpf_faixa_2_ate: config.irpf_faixa_2_ate || 3751.05,
        irpf_faixa_2_aliquota: config.irpf_faixa_2_aliquota || 7.5,
        irpf_faixa_3_ate: config.irpf_faixa_3_ate || 4664.68,
        irpf_faixa_3_aliquota: config.irpf_faixa_3_aliquota || 15,
        irpf_faixa_4_ate: config.irpf_faixa_4_ate || 5555.48,
        irpf_faixa_4_aliquota: config.irpf_faixa_4_aliquota || 22.5,
        irpf_faixa_5_aliquota: config.irpf_faixa_5_aliquota || 27.5,
        irpf_deducao_faixa_2: config.irpf_deducao_faixa_2 || 211.95,
        irpf_deducao_faixa_3: config.irpf_deducao_faixa_3 || 528.94,
        irpf_deducao_faixa_4: config.irpf_deducao_faixa_4 || 990.55,
        irpf_deducao_faixa_5: config.irpf_deducao_faixa_5 || 1613.03,
        fgts_aliquota: config.fgts_aliquota || 8,
        deducao_dependente: config.deducao_dependente || 189.59,
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating config impostos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
