import { ClienteRepository } from '../repositories/cliente.repository'
import { validateClienteData } from '@/lib/utils/validators'
import { logger } from '@/lib/utils/logger'
import { AppError } from '@/src/shared/errors/app.error'

/**
 * Cliente Service
 * Lógica de negócio para gerenciamento de clientes (CRM)
 * Multi-tenant com isolamento por tenantId
 */
export class ClienteService {
  private repository: ClienteRepository

  constructor() {
    this.repository = new ClienteRepository()
  }

  async criar(userId: string, tenantId: string, dados: any) {
    try {
      validateClienteData(dados)
      
      logger.info('ClienteService', 'Criando cliente', { userId, tenantId })
      
      const cliente = await this.repository.create(userId, tenantId, dados)
      
      logger.info('ClienteService', 'Cliente criado com sucesso', { clienteId: cliente.id, tenantId })
      
      return cliente
    } catch (error) {
      logger.error('ClienteService', 'Erro ao criar cliente', error)
      throw error
    }
  }

  async obter(userId: string, tenantId: string, clienteId: number) {
    const cliente = await this.repository.findById(clienteId, userId, tenantId)
    
    if (!cliente) {
      throw AppError.NotFound('Cliente')
    }
    
    return cliente
  }

  async listar(userId: string, tenantId: string, filtros?: any) {
    logger.info('ClienteService', 'Listando clientes', { userId, tenantId, filtros })
    return await this.repository.findAll(userId, tenantId, filtros)
  }

  async atualizar(userId: string, tenantId: string, clienteId: number, dados: any) {
    try {
      const cliente = await this.repository.findById(clienteId, userId, tenantId)
      
      if (!cliente) {
        throw AppError.NotFound('Cliente')
      }
      
      validateClienteData(dados, true)
      
      const clienteAtualizado = await this.repository.update(clienteId, userId, tenantId, dados)
      
      logger.info('ClienteService', 'Cliente atualizado', { clienteId, tenantId })
      
      return clienteAtualizado[0]
    } catch (error) {
      logger.error('ClienteService', 'Erro ao atualizar cliente', error)
      throw error
    }
  }

  async deletar(userId: string, tenantId: string, clienteId: number) {
    try {
      const cliente = await this.repository.findById(clienteId, userId, tenantId)
      
      if (!cliente) {
        throw AppError.NotFound('Cliente')
      }
      
      await this.repository.delete(clienteId, userId, tenantId)
      
      logger.info('ClienteService', 'Cliente deletado', { clienteId, tenantId })
      
      return true
    } catch (error) {
      logger.error('ClienteService', 'Erro ao deletar cliente', error)
      throw error
    }
  }

  async obterSatisfacaoMedia(userId: string, tenantId: string) {
    return await this.repository.getSatisfacaoMedia(userId, tenantId)
  }

  async adicionarValor(userId: string, tenantId: string, clienteId: number, valor: number) {
    const cliente = await this.repository.findById(clienteId, userId, tenantId)
    
    if (!cliente) {
      throw AppError.NotFound('Cliente')
    }
    
    const valorAtual = parseFloat(cliente.valor_acumulado) || 0
    const novoValor = valorAtual + valor
    
    return await this.repository.updateValorAcumulado(clienteId, userId, tenantId, novoValor)
  }
}

export const clienteService = new ClienteService()
