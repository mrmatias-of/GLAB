import { servicosRepository } from '@/lib/repositories/servicos.repository'
import { logger } from '@/lib/utils/logger'

export class ServicosService {
  async listar(userId: string, filtros?: any) {
    try {
      let servicos = await servicosRepository.findByUserId(userId)
      
      if (filtros?.nome) {
        servicos = await servicosRepository.findByNome(userId, filtros.nome)
      }
      
      return servicos
    } catch (error) {
      logger.error('ServicosService', 'listar', error)
      throw error
    }
  }

  async obter(userId: string, id: number) {
    try {
      const servico = await servicosRepository.findById(userId, id)
      if (!servico) {
        throw new Error('Serviço não encontrado')
      }
      return servico
    } catch (error) {
      logger.error('ServicosService', 'obter', error)
      throw error
    }
  }

  async criar(userId: string, dados: any) {
    try {
      if (!dados.nome) throw new Error('Nome do serviço é obrigatório')
      if (!dados.valor_padrao || dados.valor_padrao <= 0) throw new Error('Valor padrão inválido')
      
      logger.info('ServicosService', 'criar', { userId, nome: dados.nome })
      return await servicosRepository.create(userId, dados)
    } catch (error) {
      logger.error('ServicosService', 'criar', error)
      throw error
    }
  }

  async atualizar(userId: string, id: number, dados: any) {
    try {
      const servico = await this.obter(userId, id)
      logger.info('ServicosService', 'atualizar', { userId, id })
      return await servicosRepository.update(userId, id, dados)
    } catch (error) {
      logger.error('ServicosService', 'atualizar', error)
      throw error
    }
  }

  async deletar(userId: string, id: number) {
    try {
      const servico = await this.obter(userId, id)
      logger.info('ServicosService', 'deletar', { userId, id })
      return await servicosRepository.delete(userId, id)
    } catch (error) {
      logger.error('ServicosService', 'deletar', error)
      throw error
    }
  }

  async calcularValorOS(userId: string, servicosIds: number[], quantidades: number[]): Promise<number> {
    try {
      let valorTotal = 0
      for (let i = 0; i < servicosIds.length; i++) {
        const servico = await this.obter(userId, servicosIds[i])
        valorTotal += parseFloat(servico.valor_padrao.toString()) * quantidades[i]
      }
      return valorTotal
    } catch (error) {
      logger.error('ServicosService', 'calcularValorOS', error)
      throw error
    }
  }
}

export const servicosService = new ServicosService()
