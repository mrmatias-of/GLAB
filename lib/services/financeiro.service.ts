import { financeiroRepository } from '@/lib/repositories/financeiro.repository'
import { validateFinanceiroData } from '@/lib/utils/validators'
import { AppError } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

export class FinanceiroService {
  async criar(userId: string, dados: any) {
    validateFinanceiroData(dados)
    logger.info('FinanceiroService', 'Registrando transação', { userId, tipo: dados.tipo })

    return await financeiroRepository.criar({
      userId,
      ...dados,
      data: new Date(dados.data),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  async obter(userId: string, id: number) {
    const transacao = await financeiroRepository.obter(id, userId)
    if (!transacao) {
      throw new AppError('Transação não encontrada', 404)
    }
    return transacao
  }

  async listar(userId: string, filtros: any = {}) {
    return await financeiroRepository.listar(userId, filtros)
  }

  async atualizar(userId: string, id: number, dados: any) {
    await this.obter(userId, id)
    validateFinanceiroData(dados, true)

    logger.info('FinanceiroService', 'Atualizando transação', { userId, id })
    return await financeiroRepository.atualizar(id, userId, dados)
  }

  async deletar(userId: string, id: number) {
    await this.obter(userId, id)

    logger.info('FinanceiroService', 'Deletando transação', { userId, id })
    await financeiroRepository.deletar(id, userId)
  }

  async obterResumo(userId: string, dataInicio?: Date, dataFim?: Date) {
    const receitas = await financeiroRepository.obterReceitas(userId, dataInicio, dataFim)
    const despesas = await financeiroRepository.obterDespesas(userId, dataInicio, dataFim)

    const totalReceitas = receitas.reduce((acc: number, r: any) => acc + (r.valor || 0), 0)
    const totalDespesas = despesas.reduce((acc: number, d: any) => acc + (d.valor || 0), 0)
    const lucro = totalReceitas - totalDespesas
    const margem = totalReceitas > 0 ? (lucro / totalReceitas) * 100 : 0

    return {
      totalReceitas,
      totalDespesas,
      lucro,
      margem: Math.round(margem * 100) / 100,
      quantidadeReceitas: receitas.length,
      quantidadeDespesas: despesas.length,
    }
  }

  async obterDashboard(userId: string) {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)

    const resumoMensal = await this.obterResumo(userId, inicioMes, fimMes)
    const resumoDiario = await this.obterResumo(userId, hoje, new Date())

    const transacoes = await this.listar(userId, {
      dataInicio: inicioMes,
      dataFim: fimMes,
    })

    const receitasPorDia: any = {}
    const despesasPorDia: any = {}

    transacoes.forEach((t: any) => {
      const dia = new Date(t.data).toLocaleDateString('pt-BR')
      if (t.tipo === 'receita') {
        receitasPorDia[dia] = (receitasPorDia[dia] || 0) + (t.valor || 0)
      } else {
        despesasPorDia[dia] = (despesasPorDia[dia] || 0) + (t.valor || 0)
      }
    })

    return {
      resumoMensal,
      resumoDiario,
      receitasPorDia,
      despesasPorDia,
      transacoesPendentes: transacoes.filter((t: any) => t.status === 'pendente').length,
      transacoesPagas: transacoes.filter((t: any) => t.status === 'pago').length,
    }
  }

  async registrarReceita(userId: string, dados: any) {
    return await this.criar(userId, {
      ...dados,
      tipo: 'receita',
      status: 'pago',
    })
  }

  async registrarDespesa(userId: string, dados: any) {
    return await this.criar(userId, {
      ...dados,
      tipo: 'despesa',
      status: dados.status || 'pendente',
    })
  }
}

export const financeiroService = new FinanceiroService()
