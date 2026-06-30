import { logger } from '@/lib/utils/logger'

interface Localizacao {
  latitude: number
  longitude: number
  timestamp: Date
}

export class GeolocalizacaoService {
  private localizacoesTecnicos: Map<number, Localizacao> = new Map()

  registrarLocalizacao(tecnicoId: number, latitude: number, longitude: number) {
    try {
      logger.info('GeolocalizacaoService', 'registrarLocalizacao', { tecnicoId, latitude, longitude })

      this.localizacoesTecnicos.set(tecnicoId, {
        latitude,
        longitude,
        timestamp: new Date(),
      })

      return {
        success: true,
        tecnicoId,
        localizacao: { latitude, longitude },
        timestamp: new Date(),
      }
    } catch (error) {
      logger.error('GeolocalizacaoService', 'registrarLocalizacao', error)
      throw error
    }
  }

  obterLocalizacao(tecnicoId: number) {
    try {
      const localizacao = this.localizacoesTecnicos.get(tecnicoId)

      if (!localizacao) {
        return null
      }

      const agora = new Date()
      const minutos = (agora.getTime() - localizacao.timestamp.getTime()) / (1000 * 60)

      // Se passou mais de 30 minutos, considerar como offline
      if (minutos > 30) {
        return { ...localizacao, online: false, minutos_offline: Math.round(minutos) }
      }

      return { ...localizacao, online: true }
    } catch (error) {
      logger.error('GeolocalizacaoService', 'obterLocalizacao', error)
      throw error
    }
  }

  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Raio da terra em km
    const dLat = this.degreesToRadians(lat2 - lat1)
    const dLon = this.degreesToRadians(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distancia = R * c

    return Math.round(distancia * 100) / 100 // 2 casas decimais
  }

  private degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180
  }

  obterTecnicosProximos(latitude: number, longitude: number, raioKm: number = 5) {
    try {
      logger.info('GeolocalizacaoService', 'obterTecnicosProximos', { latitude, longitude, raioKm })

      const proximos = []

      for (const [tecnicoId, localizacao] of this.localizacoesTecnicos) {
        const distancia = this.calcularDistancia(latitude, longitude, localizacao.latitude, localizacao.longitude)

        if (distancia <= raioKm) {
          proximos.push({
            tecnicoId,
            distancia,
            localizacao: { latitude: localizacao.latitude, longitude: localizacao.longitude },
            ultimaAtualizacao: localizacao.timestamp,
          })
        }
      }

      return proximos.sort((a, b) => a.distancia - b.distancia)
    } catch (error) {
      logger.error('GeolocalizacaoService', 'obterTecnicosProximos', error)
      throw error
    }
  }

  obterTodosTecnicosOnline() {
    try {
      const online = []

      for (const [tecnicoId, localizacao] of this.localizacoesTecnicos) {
        const agora = new Date()
        const minutos = (agora.getTime() - localizacao.timestamp.getTime()) / (1000 * 60)

        if (minutos <= 30) {
          online.push({
            tecnicoId,
            localizacao: { latitude: localizacao.latitude, longitude: localizacao.longitude },
            ultimaAtualizacao: localizacao.timestamp,
          })
        }
      }

      return online
    } catch (error) {
      logger.error('GeolocalizacaoService', 'obterTodosTecnicosOnline', error)
      throw error
    }
  }

  limparLocalizacoesAntigas(minutosLimite: number = 120) {
    try {
      const agora = new Date()
      let removidos = 0

      for (const [tecnicoId, localizacao] of this.localizacoesTecnicos) {
        const minutos = (agora.getTime() - localizacao.timestamp.getTime()) / (1000 * 60)

        if (minutos > minutosLimite) {
          this.localizacoesTecnicos.delete(tecnicoId)
          removidos++
        }
      }

      logger.info('GeolocalizacaoService', 'limparLocalizacoesAntigas', { removidos })
      return { removidos, total_restante: this.localizacoesTecnicos.size }
    } catch (error) {
      logger.error('GeolocalizacaoService', 'limparLocalizacoesAntigas', error)
      throw error
    }
  }
}

export const geolocalizacaoService = new GeolocalizacaoService()
