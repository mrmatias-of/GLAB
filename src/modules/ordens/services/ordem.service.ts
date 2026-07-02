import { OrdemRepository } from '../repositories/ordem.repository'
import { validateOrdemData } from '@/lib/utils/validators'
import { logger } from '@/lib/utils/logger'
import { AppError } from '@/lib/utils/api-response'

const repository = new OrdemRepository()

export class OrdemService {
  async criar(userId: string, tenantId: string, dados: any) {
    try {
      validateOrdemData(dados)
      
      logger.info('OrdemService', 'Criando ordem de serviço', { userId })
      
      const ordem = await repository.create(userId, dados)
      
      logger.info('OrdemService', 'Ordem criada com sucesso', { ordemId: ordem.id })
      
      return ordem
    } catch (error) {
      logger.error('OrdemService', 'Erro ao criar ordem', error)
      throw error
    }
  }

  async obter(userId: string, tenantId: string, ordemId: number) {
    const ordem = await repository.findById(ordemId, userId)
    
    if (!ordem) {
      throw new AppError('Ordem não encontrada', 404)
    }
    
    return ordem
  }

  async listar(userId: string, tenantId: string, filtros?: any) {
    logger.info('OrdemService', 'Listando ordens', { userId, filtros })
    return await repository.findAll(userId, filtros)
  }

  async listarPorStatus(userId: string, tenantId: string, status: string) {
    return await repository.findByStatus(userId, status)
  }

  async atualizar(userId: string, tenantId: string, ordemId: number, dados: any) {
    try {
      const ordem = await repository.findById(ordemId, userId)
      
      if (!ordem) {
        throw new AppError('Ordem não encontrada', 404)
      }
      
      validateOrdemData(dados, true)
      
      const ordemAtualizada = await repository.update(ordemId, userId, dados)
      
      logger.info('OrdemService', 'Ordem atualizada', { ordemId })
      
      return ordemAtualizada
    } catch (error) {
      logger.error('OrdemService', 'Erro ao atualizar ordem', error)
      throw error
    }
  }

  async alterarStatus(userId: string, tenantId: string, ordemId: number, novoStatus: string) {
    try {
      const ordemValida = await repository.findById(ordemId, userId)
      
      if (!ordemValida) {
        throw new AppError('Ordem não encontrada', 404)
      }
      
      const statusValidos = ['aberto', 'em_progresso', 'pausado', 'finalizado', 'cancelado']
      if (!statusValidos.includes(novoStatus)) {
        throw new AppError('Status inválido', 400)
      }
      
      const ordem = await repository.updateStatus(ordemId, userId, novoStatus)
      
      logger.info('OrdemService', 'Status alterado', { ordemId, novoStatus })
      
      return ordem
    } catch (error) {
      logger.error('OrdemService', 'Erro ao alterar status', error)
      throw error
    }
  }

  async obterCounts(userId: string, tenantId: string) {
    return await repository.getStatusCounts(userId)
  }

  async obterProximasVencer(userId: string, tenantId: string) {
    return await repository.getProximasVencer(userId)
  }

  async deletar(userId: string, tenantId: string, ordemId: number) {
    try {
      const ordem = await repository.findById(ordemId, userId)
      
      if (!ordem) {
        throw new AppError('Ordem não encontrada', 404)
      }
      
      logger.info('OrdemService', 'Ordem cancelada', { ordemId })
      
      return await repository.updateStatus(ordemId, userId, 'cancelado')
    } catch (error) {
      logger.error('OrdemService', 'Erro ao cancelar ordem', error)
      throw error
    }
  }
}

export const ordemService = new OrdemService()
