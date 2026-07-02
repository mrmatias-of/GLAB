import { ServicoRepository } from '../repositories/servico.repository'
import { validateServicoData } from '../validators'
import { logger } from '@/lib/logging'
import { AppError } from '@/lib/errors'

export class ServicoService {
  private repository: ServicoRepository

  constructor() {
    this.repository = new ServicoRepository()
  }

  async criar(userId: string, tenantId: string, dados: any) {
    try {
      validateServicoData(dados)
      
      logger.info('ServicoService', 'Criando serviço', { userId, nome: dados.nome })
      
      const servico = await this.repository.criar({ ...dados, userId })
      
      logger.info('ServicoService', 'Serviço criado', { servicoId: servico.id })
      
      return servico
    } catch (error) {
      logger.error('ServicoService', 'Erro ao criar serviço', error)
      throw error
    }
  }

  async obter(userId: string, tenantId: string, id: number) {
    const servico = await this.repository.obter(id, userId)
    if (!servico) {
      throw AppError.NotFound('Serviço')
    }
    return servico
  }

  async listar(userId: string, tenantId: string, filtros?: any) {
    logger.info('ServicoService', 'Listando serviços', { userId })
    return await this.repository.listar(userId, filtros)
  }

  async listarAtivos(userId: string, tenantId: string) {
    return await this.repository.obterAtivos(userId)
  }

  async atualizar(userId: string, tenantId: string, id: number, dados: any) {
    try {
      await this.obter(userId, tenantId, id)
      validateServicoData(dados, true)
      
      logger.info('ServicoService', 'Atualizando serviço', { userId, id })
      return await this.repository.atualizar(id, userId, dados)
    } catch (error) {
      logger.error('ServicoService', 'Erro ao atualizar serviço', error)
      throw error
    }
  }

  async deletar(userId: string, tenantId: string, id: number) {
    try {
      await this.obter(userId, tenantId, id)
      
      logger.info('ServicoService', 'Deletando serviço', { userId, id })
      await this.repository.deletar(id, userId)
    } catch (error) {
      logger.error('ServicoService', 'Erro ao deletar serviço', error)
      throw error
    }
  }

  async obterPorCategoria(userId: string, tenantId: string, categoria: string) {
    const servicos = await this.listar(userId, tenantId)
    return servicos.filter((s: any) => s.categoria === categoria)
  }
}
