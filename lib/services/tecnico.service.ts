import { TecnicoRepository } from '@/lib/repositories/tecnico.repository'
import { validateTecnicoData } from '@/lib/utils/validators'
import { logger } from '@/lib/utils/logger'
import { AppError } from '@/lib/utils/api-response'

const repository = new TecnicoRepository()

export class TecnicoService {
  async criar(userId: string, dados: any) {
    try {
      validateTecnicoData(dados)
      
      logger.info('TecnicoService', 'Criando técnico', { userId })
      
      const tecnico = await repository.create(userId, dados)
      
      logger.info('TecnicoService', 'Técnico criado com sucesso', { tecnicoId: tecnico.id })
      
      return tecnico
    } catch (error) {
      logger.error('TecnicoService', 'Erro ao criar técnico', error)
      throw error
    }
  }

  async obter(userId: string, tecnicoId: number) {
    const tecnico = await repository.findById(tecnicoId, userId)
    
    if (!tecnico) {
      throw new AppError('Técnico não encontrado', 404)
    }
    
    return tecnico
  }

  async listar(userId: string, filtros?: any) {
    logger.info('TecnicoService', 'Listando técnicos', { userId, filtros })
    return await repository.findAll(userId, filtros)
  }

  async listarAtivos(userId: string) {
    return await repository.findAtivos(userId)
  }

  async atualizar(userId: string, tecnicoId: number, dados: any) {
    try {
      const tecnico = await repository.findById(tecnicoId, userId)
      
      if (!tecnico) {
        throw new AppError('Técnico não encontrado', 404)
      }
      
      validateTecnicoData(dados, true)
      
      const tecnicoAtualizado = await repository.update(tecnicoId, userId, dados)
      
      logger.info('TecnicoService', 'Técnico atualizado', { tecnicoId })
      
      return tecnicoAtualizado[0]
    } catch (error) {
      logger.error('TecnicoService', 'Erro ao atualizar técnico', error)
      throw error
    }
  }

  async deletar(userId: string, tecnicoId: number) {
    try {
      const tecnico = await repository.findById(tecnicoId, userId)
      
      if (!tecnico) {
        throw new AppError('Técnico não encontrado', 404)
      }
      
      await repository.update(tecnicoId, userId, { status: 'inativo' })
      
      logger.info('TecnicoService', 'Técnico desativado', { tecnicoId })
      
      return true
    } catch (error) {
      logger.error('TecnicoService', 'Erro ao desativar técnico', error)
      throw error
    }
  }

  async atualizarLocalizacao(userId: string, tecnicoId: number, latitude: number, longitude: number) {
    try {
      const tecnico = await repository.findById(tecnicoId, userId)
      
      if (!tecnico) {
        throw new AppError('Técnico não encontrado', 404)
      }
      
      return await repository.updateLocalizacao(tecnicoId, userId, latitude, longitude)
    } catch (error) {
      logger.error('TecnicoService', 'Erro ao atualizar localização', error)
      throw error
    }
  }

  async obterTop5Produtivos(userId: string) {
    return await repository.getTop5Produtivos(userId)
  }

  async obterMediaRating(userId: string) {
    return await repository.getMediaRating(userId)
  }
}

export const tecnicoService = new TecnicoService()
