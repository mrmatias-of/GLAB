import { ComissaoRepository } from '../repositories/comissao.repository'
import { validateComissaoData } from '../validators'
import { logger } from '@/lib/logging'
import { AppError } from '@/lib/errors'

export class ComissaoService {
  private repository: ComissaoRepository

  constructor() {
    this.repository = new ComissaoRepository()
  }

  async criar(userId: string, tenantId: string, dados: any) {
    try {
      validateComissaoData(dados)
      
      logger.info('ComissaoService', 'Criando comissão', { userId, tecnicoId: dados.tecnico_id })
      
      const comissao = await this.repository.criar({
        ...dados,
        userId,
        tipo: 'comissao',
        status: 'pendente',
      })
      
      logger.info('ComissaoService', 'Comissão criada', { comissaoId: comissao.id })
      
      return comissao
    } catch (error) {
      logger.error('ComissaoService', 'Erro ao criar comissão', error)
      throw error
    }
  }

  async obter(userId: string, tenantId: string, id: number) {
    const comissao = await this.repository.obter(id, userId)
    if (!comissao) {
      throw AppError.NotFound('Comissão')
    }
    return comissao
  }

  async listarPorTecnico(userId: string, tenantId: string, tecnicoId: number, dataInicio?: Date, dataFim?: Date) {
    logger.info('ComissaoService', 'Listando comissões por técnico', { userId, tecnicoId })
    return await this.repository.listarPorTecnico(userId, tecnicoId, dataInicio, dataFim)
  }

  async listarTodas(userId: string, tenantId: string, dataInicio?: Date, dataFim?: Date) {
    logger.info('ComissaoService', 'Listando todas as comissões', { userId })
    return await this.repository.listarTodas(userId, dataInicio, dataFim)
  }

  async atualizar(userId: string, tenantId: string, id: number, dados: any) {
    try {
      await this.obter(userId, tenantId, id)
      validateComissaoData(dados, true)
      
      logger.info('ComissaoService', 'Atualizando comissão', { userId, id })
      return await this.repository.atualizar(id, userId, dados)
    } catch (error) {
      logger.error('ComissaoService', 'Erro ao atualizar comissão', error)
      throw error
    }
  }

  async pagarComissao(userId: string, tenantId: string, id: number) {
    try {
      const comissao = await this.obter(userId, tenantId, id)
      
      if (comissao.status === 'pago') {
        throw new AppError('Comissão já foi paga', 400)
      }
      
      logger.info('ComissaoService', 'Marcando comissão como paga', { userId, id })
      
      return await this.repository.atualizar(id, userId, {
        status: 'pago',
        data_pagamento: new Date(),
      })
    } catch (error) {
      logger.error('ComissaoService', 'Erro ao pagar comissão', error)
      throw error
    }
  }

  async calcularComissaoPorOS(userId: string, tenantId: string, osId: number, valorOS: number, percentualComissao: number) {
    // TODO: Calculate and create commission record for this work order
    const valor = (valorOS * percentualComissao) / 100
    return {
      osId,
      valorCalculado: valor,
      percentualComissao,
    }
  }

  async obterResumo(userId: string, tenantId: string) {
    const todasComissoes = await this.listarTodas(userId, tenantId)
    
    const totalPendente = todasComissoes
      .filter((c: any) => c.status === 'pendente')
      .reduce((acc: number, c: any) => acc + (c.valor || 0), 0)
    
    const totalPago = todasComissoes
      .filter((c: any) => c.status === 'pago')
      .reduce((acc: number, c: any) => acc + (c.valor || 0), 0)
    
    return {
      totalComissoes: todasComissoes.length,
      totalPendente,
      totalPago,
      comissoesPorTecnico: this.agruparPorTecnico(todasComissoes),
    }
  }

  private agruparPorTecnico(comissoes: any[]) {
    const grupos: any = {}
    
    comissoes.forEach((c: any) => {
      const tecnicoId = c.tecnico_id
      if (!grupos[tecnicoId]) {
        grupos[tecnicoId] = {
          tecnicoId,
          total: 0,
          pendente: 0,
          pago: 0,
          quantidade: 0,
        }
      }
      
      grupos[tecnicoId].total += c.valor || 0
      grupos[tecnicoId].quantidade += 1
      
      if (c.status === 'pendente') {
        grupos[tecnicoId].pendente += c.valor || 0
      } else if (c.status === 'pago') {
        grupos[tecnicoId].pago += c.valor || 0
      }
    })
    
    return Object.values(grupos)
  }

  async registrarPagamentoComissao(userId: string, tecnicoId: number, dataInicio: Date, dataFim: Date) {
    try {
      logger.info('ComissaoService', 'Registrando pagamento de comissão', { userId, tecnicoId })
      
      // TODO: Calculate commission based on work orders completed by tecnico between dates
      // For now, return a placeholder result
      const resultado = {
        tecnicoId,
        tecnicoNome: '',
        valorTotal: 0,
        quantidadeOS: 0,
        comissaoPercentual: 0,
        comissao: 0,
      }
      
      return resultado
    } catch (error) {
      logger.error('ComissaoService', 'Erro ao registrar pagamento de comissão', error)
      throw error
    }
  }
}
