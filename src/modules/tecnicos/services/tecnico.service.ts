import { TecnicoRepository } from '../repositories/tecnico.repository'
import { validateTecnicoData } from '../validators'
import { logger } from '@/lib/logging'
import { AppError } from '@/lib/errors'

export class TecnicoService {
  private repository: TecnicoRepository

  constructor() {
    this.repository = new TecnicoRepository()
  }

  async criar(userId: string, tenantId: string, dados: any) {
    try {
      validateTecnicoData(dados)
      
      logger.info('TecnicoService', 'Criando técnico', { userId, nome: dados.nome })
      
      const tecnico = await this.repository.criar({ ...dados, userId })
      
      logger.info('TecnicoService', 'Técnico criado', { tecnicoId: tecnico.id })
      
      return tecnico
    } catch (error) {
      logger.error('TecnicoService', 'Erro ao criar técnico', error)
      throw error
    }
  }

  async obter(userId: string, tenantId: string, id: number) {
    const tecnico = await this.repository.obter(id, userId)
    if (!tecnico) {
      throw AppError.NotFound('Técnico')
    }
    return tecnico
  }

  async listar(userId: string, tenantId: string, filtros?: any) {
    logger.info('TecnicoService', 'Listando técnicos', { userId })
    return await this.repository.listar(userId, filtros)
  }

  async listarAtivos(userId: string, tenantId: string) {
    return await this.repository.obterAtivos(userId)
  }

  async obterPorEspecialidade(userId: string, tenantId: string, especialidade: string) {
    return await this.repository.obterPorEspecialidade(userId, especialidade)
  }

  async atualizar(userId: string, tenantId: string, id: number, dados: any) {
    try {
      await this.obter(userId, tenantId, id)
      validateTecnicoData(dados, true)
      
      logger.info('TecnicoService', 'Atualizando técnico', { userId, id })
      return await this.repository.atualizar(id, userId, dados)
    } catch (error) {
      logger.error('TecnicoService', 'Erro ao atualizar técnico', error)
      throw error
    }
  }

  async deletar(userId: string, tenantId: string, id: number) {
    try {
      await this.obter(userId, tenantId, id)
      
      logger.info('TecnicoService', 'Deletando técnico', { userId, id })
      await this.repository.deletar(id, userId)
    } catch (error) {
      logger.error('TecnicoService', 'Erro ao deletar técnico', error)
      throw error
    }
  }

  async atualizarRating(userId: string, tenantId: string, id: number, novoRating: number) {
    await this.obter(userId, tenantId, id)
    
    if (novoRating < 0 || novoRating > 5) {
      throw new AppError('Rating deve estar entre 0 e 5', 400)
    }
    
    return await this.repository.atualizarRating(id, userId, novoRating)
  }

  async atualizarOsConcluidas(userId: string, tenantId: string, id: number, quantidade: number) {
    await this.obter(userId, tenantId, id)
    return await this.repository.atualizarOsConcluidas(id, userId, quantidade)
  }

  async atualizarLocalizacao(userId: string, tenantId: string, id: number, latitude: number, longitude: number) {
    await this.obter(userId, tenantId, id)
    
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new AppError('Coordenadas geográficas inválidas', 400)
    }
    
    return await this.repository.atualizarLocalizacao(id, userId, latitude, longitude)
  }

  async obterTeonicosMaisProximos(userId: string, tenantId: string, latitude: number, longitude: number, distanciaMaximaKm: number = 50) {
    const tecnicos = await this.listarAtivos(userId, tenantId)
    
    // TODO: Implement geospatial distance calculation
    // For now, return all active technicians
    return tecnicos
  }

  async obterDesempenho(userId: string, tenantId: string, id: number) {
    const tecnico = await this.obter(userId, tenantId, id)
    
    return {
      id: tecnico.id,
      nome: tecnico.nome,
      osConcluidas: tecnico.os_concluidas || 0,
      rating: tecnico.rating || 0,
      comissaoPercentual: tecnico.comissao_percentual || 0,
      especializacao: tecnico.especialidade,
    }
  }
}
