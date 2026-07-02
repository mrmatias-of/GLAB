import { logger } from '@/lib/logging'
import { AppError } from '@/lib/errors'

interface LocalizacaoTecnico {
  id: number
  nome: string
  latitude: number
  longitude: number
  especialidade: string
}

interface Ordem {
  id: number
  cliente_id: number
  endereco: string
  latitude: number
  longitude: number
  prioridade: string
  data_prevista: Date
}

/**
 * Roteamento Service
 * Handles route optimization and technician dispatch
 * Uses geospatial calculations to assign orders to nearest technicians
 */
export class RoteamentoService {
  /**
   * Calculate optimal route for a technician
   */
  async calcularRotaOtima(userId: string, tenantId: string, tecnicoId: number, ordens: Ordem[]) {
    try {
      logger.info('RoteamentoService', 'Calculando rota ótima', { userId, tecnicoId, ordens: ordens.length })

      // TODO: Implement actual route optimization (TSP - Traveling Salesman Problem)
      // Using services like:
      // - Google Maps API
      // - OSRM (Open Source Routing Machine)
      // - Mapbox Directions API
      // - Vroom API (vehicle routing)

      const rotaOtimizada = this.simularOtimizacaoRota(ordens)

      logger.info('RoteamentoService', 'Rota calculada', { userId, tecnicoId })

      return {
        tecnicoId,
        ordens: rotaOtimizada,
        tempoEstimadoTotal: this.calcularTempoTotal(rotaOtimizada),
        distanciaTotal: this.calcularDistanciaTotal(rotaOtimizada),
        calculadoEm: new Date(),
      }
    } catch (error) {
      logger.error('RoteamentoService', 'Erro ao calcular rota', error)
      throw error
    }
  }

  /**
   * Assign orders to nearest technicians
   */
  async atribuirTecnicosOtimo(
    userId: string,
    tenantId: string,
    ordens: Ordem[],
    tecnicos: LocalizacaoTecnico[]
  ) {
    try {
      logger.info('RoteamentoService', 'Atribuindo técnicos', { userId, ordens: ordens.length, tecnicos: tecnicos.length })

      const atribuicoes = this.calcularMelhorAtribuicao(ordens, tecnicos)

      logger.info('RoteamentoService', 'Técnicos atribuídos', { userId, atribuicoes: atribuicoes.length })

      return {
        atribuicoes,
        eficiencia: this.calcularEficiencia(atribuicoes),
        calculadoEm: new Date(),
      }
    } catch (error) {
      logger.error('RoteamentoService', 'Erro ao atribuir técnicos', error)
      throw error
    }
  }

  /**
   * Find nearest technician for a specific order
   */
  async obterTecnicoMaisProximo(
    userId: string,
    tenantId: string,
    ordem: Ordem,
    tecnicos: LocalizacaoTecnico[]
  ) {
    try {
      logger.info('RoteamentoService', 'Buscando técnico mais próximo', { userId, ordemId: ordem.id })

      const tecnicosFiltrados = this.filtrarPorEspecialidade(tecnicos, ordem)
      const tecnicoMaisProximo = this.encontrarMaisProximo(ordem, tecnicosFiltrados)

      if (!tecnicoMaisProximo) {
        throw new AppError('Nenhum técnico disponível para essa ordem', 404)
      }

      const distancia = this.calcularDistancia(
        ordem.latitude,
        ordem.longitude,
        tecnicoMaisProximo.latitude,
        tecnicoMaisProximo.longitude
      )

      logger.info('RoteamentoService', 'Técnico encontrado', { userId, tecnicoId: tecnicoMaisProximo.id, distancia })

      return {
        tecnico: tecnicoMaisProximo,
        distancia,
        tempoEstimado: distancia / 50, // Rough estimate: 50km/h average
      }
    } catch (error) {
      logger.error('RoteamentoService', 'Erro ao obter técnico próximo', error)
      throw error
    }
  }

  /**
   * Calculate distance matrix between multiple points
   */
  async calcularMatrizDistancias(
    userId: string,
    tenantId: string,
    pontos: { id: string; latitude: number; longitude: number }[]
  ) {
    try {
      logger.info('RoteamentoService', 'Calculando matriz de distâncias', { userId, pontos: pontos.length })

      const matriz: any = {}

      for (let i = 0; i < pontos.length; i++) {
        for (let j = 0; j < pontos.length; j++) {
          const chave = `${pontos[i].id}-${pontos[j].id}`
          if (i === j) {
            matriz[chave] = 0
          } else {
            matriz[chave] = this.calcularDistancia(
              pontos[i].latitude,
              pontos[i].longitude,
              pontos[j].latitude,
              pontos[j].longitude
            )
          }
        }
      }

      logger.info('RoteamentoService', 'Matriz calculada', { userId })

      return matriz
    } catch (error) {
      logger.error('RoteamentoService', 'Erro ao calcular matriz', error)
      throw error
    }
  }

  /**
   * Private helper methods
   */
  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula for distance calculation
    const R = 6371 // Earth radius in km
    const dLat = this.toRad(lat2 - lat1)
    const dLon = this.toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180
  }

  private filtrarPorEspecialidade(tecnicos: LocalizacaoTecnico[], ordem: Ordem): LocalizacaoTecnico[] {
    // TODO: Filter by required specialty if ordem has specific requirements
    return tecnicos
  }

  private encontrarMaisProximo(ordem: Ordem, tecnicos: LocalizacaoTecnico[]): LocalizacaoTecnico | null {
    if (tecnicos.length === 0) return null

    let maisProximo = tecnicos[0]
    let menorDistancia = this.calcularDistancia(ordem.latitude, ordem.longitude, maisProximo.latitude, maisProximo.longitude)

    for (let i = 1; i < tecnicos.length; i++) {
      const distancia = this.calcularDistancia(ordem.latitude, ordem.longitude, tecnicos[i].latitude, tecnicos[i].longitude)
      if (distancia < menorDistancia) {
        menorDistancia = distancia
        maisProximo = tecnicos[i]
      }
    }

    return maisProximo
  }

  private simularOtimizacaoRota(ordens: Ordem[]): Ordem[] {
    // TODO: Implement proper TSP algorithm
    // For now, return sorted by priority and date
    return [...ordens].sort((a, b) => {
      const prioridadeScore: any = { alta: 0, normal: 1, baixa: 2 }
      const scoreA = prioridadeScore[a.prioridade] || 1
      const scoreB = prioridadeScore[b.prioridade] || 1

      if (scoreA !== scoreB) return scoreA - scoreB
      return new Date(a.data_prevista).getTime() - new Date(b.data_prevista).getTime()
    })
  }

  private calcularTempoTotal(ordens: Ordem[]): number {
    // TODO: Calculate actual travel time + service time
    return ordens.length * 1.5 // 1.5 hours average per order
  }

  private calcularDistanciaTotal(ordens: Ordem[]): number {
    // TODO: Calculate actual distance between points
    return ordens.length * 15 // 15km average per order
  }

  private calcularMelhorAtribuicao(ordens: Ordem[], tecnicos: LocalizacaoTecnico[]): any[] {
    // TODO: Implement optimization algorithm (Hungarian, Munkres, etc)
    // Simple greedy algorithm for now
    const atribuicoes: any[] = []

    ordens.forEach((ordem) => {
      let tecnicoEscolhido = tecnicos[0]
      let menorDistancia = Infinity

      tecnicos.forEach((tecnico) => {
        const distancia = this.calcularDistancia(ordem.latitude, ordem.longitude, tecnico.latitude, tecnico.longitude)
        if (distancia < menorDistancia) {
          menorDistancia = distancia
          tecnicoEscolhido = tecnico
        }
      })

      atribuicoes.push({
        ordem,
        tecnico: tecnicoEscolhido,
        distancia: menorDistancia,
      })
    })

    return atribuicoes
  }

  private calcularEficiencia(atribuicoes: any[]): number {
    // TODO: Calculate efficiency metric
    const distanciaTotal = atribuicoes.reduce((acc, a) => acc + a.distancia, 0)
    const distanciaMedia = atribuicoes.length > 0 ? distanciaTotal / atribuicoes.length : 0
    return Math.max(0, Math.min(100, 100 - distanciaMedia * 2))
  }
}
