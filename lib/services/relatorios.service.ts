import { db } from '@/lib/db'
import { ordens_servico, financeiro, estoque, tecnicos, clientes, movimentacao_estoque } from '@/lib/db/schema'
import { eq, and, sql, gte, lte } from 'drizzle-orm'
import { logger } from '@/lib/utils/logger'

export class RelatoriosService {
  async relatorioOS(userId: string, dataInicio?: Date, dataFim?: Date, status?: string) {
    try {
      let query = db.select().from(ordens_servico).where(eq(ordens_servico.userId, userId))

      if (dataInicio && dataFim) {
        query = query.where(
          and(
            gte(ordens_servico.data_abertura, dataInicio),
            lte(ordens_servico.data_abertura, dataFim)
          )
        )
      }

      if (status) {
        query = query.where(eq(ordens_servico.status, status))
      }

      const ordens = await query
      const total = ordens.length
      const finalizadas = ordens.filter((o) => o.status === 'finalizado').length
      const taxa_conclusao = total > 0 ? ((finalizadas / total) * 100).toFixed(2) : '0'

      return { total, finalizadas, taxa_conclusao, ordens }
    } catch (error) {
      logger.error('RelatoriosService', 'relatorioOS', error)
      throw error
    }
  }

  async relatorioFinanceiro(userId: string, dataInicio: Date, dataFim: Date) {
    try {
      const transacoes = await db
        .select()
        .from(financeiro)
        .where(
          and(
            eq(financeiro.userId, userId),
            gte(financeiro.data, dataInicio),
            lte(financeiro.data, dataFim)
          )
        )

      const receitas = transacoes
        .filter((t) => t.tipo === 'receita')
        .reduce((sum, t) => sum + parseFloat(t.valor.toString()), 0)

      const despesas = transacoes
        .filter((t) => t.tipo === 'despesa')
        .reduce((sum, t) => sum + parseFloat(t.valor.toString()), 0)

      const lucro = receitas - despesas
      const margem = receitas > 0 ? ((lucro / receitas) * 100).toFixed(2) : '0'

      return {
        periodo: { inicio: dataInicio, fim: dataFim },
        receitas,
        despesas,
        lucro,
        margem: parseFloat(margem),
        transacoes: transacoes.length,
      }
    } catch (error) {
      logger.error('RelatoriosService', 'relatorioFinanceiro', error)
      throw error
    }
  }

  async relatorioEstoque(userId: string) {
    try {
      const itens = await db.select().from(estoque).where(eq(estoque.userId, userId))

      const itemBaixo = itens.filter((i) => {
        const qtdAtual = parseFloat(i.quantidade_atual.toString())
        const qtdMinima = parseFloat(i.quantidade_minima.toString())
        return qtdAtual <= qtdMinima
      })

      const valorTotal = itens.reduce((sum, i) => sum + parseFloat(i.valor_unitario.toString()) * parseFloat(i.quantidade_atual.toString()), 0)

      return {
        total_itens: itens.length,
        itens_baixo: itemBaixo.length,
        valor_total: valorTotal,
        items_criticos: itemBaixo,
      }
    } catch (error) {
      logger.error('RelatoriosService', 'relatorioEstoque', error)
      throw error
    }
  }

  async relatorioDesempenhoTecnico(userId: string, dataInicio: Date, dataFim: Date) {
    try {
      const tecnicos_list = await db.select().from(tecnicos).where(eq(tecnicos.userId, userId))

      const desempenho = await Promise.all(
        tecnicos_list.map(async (tecnico) => {
          const ordens = await db
            .select()
            .from(ordens_servico)
            .where(
              and(
                eq(ordens_servico.userId, userId),
                eq(ordens_servico.tecnico_id, tecnico.id),
                gte(ordens_servico.data_abertura, dataInicio),
                lte(ordens_servico.data_abertura, dataFim)
              )
            )

          const finalizadas = ordens.filter((o) => o.status === 'finalizado').length
          const taxa = ordens.length > 0 ? ((finalizadas / ordens.length) * 100).toFixed(2) : '0'

          return {
            tecnicoId: tecnico.id,
            tecnicoNome: tecnico.nome,
            totalOS: ordens.length,
            osFinalizadas: finalizadas,
            taxa_conclusao: parseFloat(taxa),
          }
        })
      )

      return desempenho.sort((a, b) => b.taxa_conclusao - a.taxa_conclusao)
    } catch (error) {
      logger.error('RelatoriosService', 'relatorioDesempenhoTecnico', error)
      throw error
    }
  }

  async relatorioClientesLucrativos(userId: string, dataInicio: Date, dataFim: Date, limite: number = 10) {
    try {
      const ordens = await db
        .select()
        .from(ordens_servico)
        .where(
          and(
            eq(ordens_servico.userId, userId),
            gte(ordens_servico.data_abertura, dataInicio),
            lte(ordens_servico.data_abertura, dataFim)
          )
        )

      const clientesMap = new Map()
      for (const ordem of ordens) {
        const cliente = await db.select().from(clientes).where(eq(clientes.id, ordem.cliente_id))
        if (cliente[0]) {
          const valor = parseFloat(ordem.valor_final?.toString() || '0')
          if (clientesMap.has(ordem.cliente_id)) {
            clientesMap.get(ordem.cliente_id).valor += valor
            clientesMap.get(ordem.cliente_id).ordens += 1
          } else {
            clientesMap.set(ordem.cliente_id, { nome: cliente[0].nome, valor, ordens: 1 })
          }
        }
      }

      return Array.from(clientesMap.values()).sort((a, b) => b.valor - a.valor).slice(0, limite)
    } catch (error) {
      logger.error('RelatoriosService', 'relatorioClientesLucrativos', error)
      throw error
    }
  }

  async relatorioMovimentacoesEstoque(userId: string, dataInicio: Date, dataFim: Date) {
    try {
      const movimentacoes = await db
        .select()
        .from(movimentacao_estoque)
        .where(
          and(
            eq(movimentacao_estoque.userId, userId),
            gte(movimentacao_estoque.data, dataInicio),
            lte(movimentacao_estoque.data, dataFim)
          )
        )

      const entrada = movimentacoes.filter((m) => m.tipo === 'entrada').length
      const saida = movimentacoes.filter((m) => m.tipo === 'saida').length
      const ajuste = movimentacoes.filter((m) => m.tipo === 'ajuste').length

      return { entrada, saida, ajuste, total: movimentacoes.length, movimentacoes }
    } catch (error) {
      logger.error('RelatoriosService', 'relatorioMovimentacoesEstoque', error)
      throw error
    }
  }
}

export const relatoriosService = new RelatoriosService()
