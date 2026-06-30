import { db } from '@/lib/db'
import { ordens_servico, tecnicos, financeiro } from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { logger } from '@/lib/utils/logger'

export class ComissoesService {
  async calcularComissaoTecnico(userId: string, tecnicoId: number, dataInicio: Date, dataFim: Date) {
    try {
      const resultado = await db
        .select({
          valorTotal: sql`SUM(CAST(${ordens_servico.valor_final} AS DECIMAL))`.as('valorTotal'),
          quantidadeOS: sql`COUNT(${ordens_servico.id})`.as('quantidadeOS'),
        })
        .from(ordens_servico)
        .where(
          and(
            eq(ordens_servico.userId, userId),
            eq(ordens_servico.tecnico_id, tecnicoId),
            eq(ordens_servico.status, 'finalizado'),
            sql`DATE(${ordens_servico.data_conclusao}) BETWEEN ${dataInicio} AND ${dataFim}`
          )
        )

      const tecnico = await db
        .select()
        .from(tecnicos)
        .where(and(eq(tecnicos.id, tecnicoId), eq(tecnicos.userId, userId)))

      if (!tecnico[0]) throw new Error('Técnico não encontrado')

      const comissaoPercentual = parseFloat(tecnico[0].comissao_percentual.toString()) / 100
      const valorTotal = parseFloat(resultado[0]?.valorTotal || 0)
      const comissao = valorTotal * comissaoPercentual

      return {
        tecnicoId,
        tecnicoNome: tecnico[0].nome,
        valorTotal,
        quantidadeOS: resultado[0]?.quantidadeOS || 0,
        comissaoPercentual: parseFloat(tecnico[0].comissao_percentual.toString()),
        comissao,
      }
    } catch (error) {
      logger.error('ComissoesService', 'calcularComissaoTecnico', error)
      throw error
    }
  }

  async calcularComissoesTodosTecnicos(userId: string, dataInicio: Date, dataFim: Date) {
    try {
      const tecnicos_list = await db
        .select()
        .from(tecnicos)
        .where(eq(tecnicos.userId, userId))

      const comissoes = await Promise.all(
        tecnicos_list.map((t) => this.calcularComissaoTecnico(userId, t.id, dataInicio, dataFim))
      )

      return {
        periodo: { inicio: dataInicio, fim: dataFim },
        comissoes,
        totalComissoes: comissoes.reduce((sum, c) => sum + c.comissao, 0),
      }
    } catch (error) {
      logger.error('ComissoesService', 'calcularComissoesTodosTecnicos', error)
      throw error
    }
  }

  async gerarTransacaoComissao(userId: string, tecnicoId: number, valor: number, periodo: string) {
    try {
      logger.info('ComissoesService', 'gerarTransacaoComissao', { userId, tecnicoId, valor })

      const resultado = await db
        .insert(financeiro)
        .values({
          userId,
          tipo: 'despesa',
          descricao: `Comissão - ${periodo}`,
          valor: valor.toString(),
          categoria: 'comissao',
          status: 'pendente',
          data: new Date(),
          tecnico_id: tecnicoId,
        })
        .returning()

      return resultado[0]
    } catch (error) {
      logger.error('ComissoesService', 'gerarTransacaoComissao', error)
      throw error
    }
  }

  async registrarPagamentoComissao(userId: string, tecnicoId: number, dataInicio: Date, dataFim: Date) {
    try {
      const comissao = await this.calcularComissaoTecnico(userId, tecnicoId, dataInicio, dataFim)

      if (comissao.comissao <= 0) {
        throw new Error('Comissão zerada, sem geração de transação')
      }

      const periodo = `${dataInicio.toLocaleDateString('pt-BR')} a ${dataFim.toLocaleDateString('pt-BR')}`
      await this.gerarTransacaoComissao(userId, tecnicoId, comissao.comissao, periodo)

      logger.info('ComissoesService', 'registrarPagamentoComissao', { userId, tecnicoId, valor: comissao.comissao })

      return comissao
    } catch (error) {
      logger.error('ComissoesService', 'registrarPagamentoComissao', error)
      throw error
    }
  }
}

export const comissoesService = new ComissoesService()
