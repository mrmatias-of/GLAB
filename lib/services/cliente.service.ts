import { ClienteRepository } from '@/lib/repositories/cliente.repository'
import { validateClienteData } from '@/lib/utils/validators'
import { logger } from '@/lib/utils/logger'
import { AppError } from '@/lib/utils/api-response'

const repository = new ClienteRepository()

export class ClienteService {
  async criar(userId: string, dados: any) {
    try {
      validateClienteData(dados)
      
      logger.info('ClienteService', 'Criando cliente', { userId })
      
      const cliente = await repository.create(userId, dados)
      
      logger.info('ClienteService', 'Cliente criado com sucesso', { clienteId: cliente.id })
      
      return cliente
    } catch (error) {
      logger.error('ClienteService', 'Erro ao criar cliente', error)
      throw error
    }
  }

  async obter(userId: string, clienteId: number) {
    const cliente = await repository.findById(clienteId, userId)
    
    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404)
    }
    
    return cliente
  }

  async listar(userId: string, filtros?: any) {
    logger.info('ClienteService', 'Listando clientes', { userId, filtros })
    return await repository.findAll(userId, filtros)
  }

  async atualizar(userId: string, clienteId: number, dados: any) {
    try {
      const cliente = await repository.findById(clienteId, userId)
      
      if (!cliente) {
        throw new AppError('Cliente não encontrado', 404)
      }
      
      validateClienteData(dados, true)
      
      const clienteAtualizado = await repository.update(clienteId, userId, dados)
      
      logger.info('ClienteService', 'Cliente atualizado', { clienteId })
      
      return clienteAtualizado[0]
    } catch (error) {
      logger.error('ClienteService', 'Erro ao atualizar cliente', error)
      throw error
    }
  }

  async deletar(userId: string, clienteId: number) {
    try {
      const cliente = await repository.findById(clienteId, userId)
      
      if (!cliente) {
        throw new AppError('Cliente não encontrado', 404)
      }
      
      await repository.delete(clienteId, userId)
      
      logger.info('ClienteService', 'Cliente deletado', { clienteId })
      
      return true
    } catch (error) {
      logger.error('ClienteService', 'Erro ao deletar cliente', error)
      throw error
    }
  }

  async obterSatisfacaoMedia(userId: string) {
    return await repository.getSatisfacaoMedia(userId)
  }

  async adicionarValor(userId: string, clienteId: number, valor: number) {
    const cliente = await repository.findById(clienteId, userId)
    
    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404)
    }
    
    const valorAtual = parseFloat(cliente.valor_acumulado) || 0
    const novoValor = valorAtual + valor
    
    return await repository.updateValorAcumulado(clienteId, userId, novoValor)
  }
}

export const clienteService = new ClienteService()
