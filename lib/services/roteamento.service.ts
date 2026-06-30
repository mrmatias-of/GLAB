import { db } from '@/lib/db'
import { tecnicos, ordens_servico } from '@/lib/db/schema'
import { eq, and, lt } from 'drizzle-orm'
import { logger } from '@/lib/utils/logger'

export class RoteamentoService {
  async atribuirOSAutomaticamente(userId: string, osId: number) {
    try {
      logger.info('RoteamentoService', 'atribuirOSAutomaticamente', { userId, osId })

      const os = await db.select().from(ordens_servico).where(eq(ordens_servico.id, osId))

      if (!os[0]) throw new Error('OS não encontrada')

      const tecnicoMaisProximo = await this.obterTecnicoMaisProximo(
        userId,
        os[0].cliente_id,
        os[0].data_prevista
      )

      if (!tecnicoMaisProximo) {
        throw new Error('Nenhum técnico disponível para esta OS')
      }

      logger.info('RoteamentoService', 'atribuirOSAutomaticamente', {
        tecnicoId: tecnicoMaisProximo.id,
        tecnicoNome: tecnicoMaisProximo.nome,
      })

      return tecnicoMaisProximo
    } catch (error) {
      logger.error('RoteamentoService', 'atribuirOSAutomaticamente', error)
      throw error
    }
  }

  async obterTecnicoMaisProximo(userId: string, clienteId: number, dataPrevista: Date | null) {
    try {
      const tecnicos_disponiveis = await db
        .select()
        .from(tecnicos)
        .where(and(eq(tecnicos.userId, userId), eq(tecnicos.status, 'ativo')))

      if (tecnicos_disponiveis.length === 0) return null

      // Versão simplificada: retorna técnico com menos OS
      const cargaDeTrabaho = await Promise.all(
        tecnicos_disponiveis.map(async (t) => {
          const osAtribuidas = await db
            .select()
            .from(ordens_servico)
            .where(
              and(
                eq(ordens_servico.userId, userId),
                eq(ordens_servico.tecnico_id, t.id),
                lt(ordens_servico.status, 'finalizado')
              )
            )
          return { tecnico: t, carga: osAtribuidas.length }
        })
      )

      const tecnicoMenos = cargaDeTrabaho.reduce((prev, curr) => (prev.carga < curr.carga ? prev : curr))

      return tecnicoMenos.tecnico
    } catch (error) {
      logger.error('RoteamentoService', 'obterTecnicoMaisProximo', error)
      throw error
    }
  }

  async otimizarRotaTecnicos(userId: string, tecnicoId: number) {
    try {
      logger.info('RoteamentoService', 'otimizarRotaTecnicos', { userId, tecnicoId })

      const osDoTecnico = await db
        .select()
        .from(ordens_servico)
        .where(
          and(
            eq(ordens_servico.userId, userId),
            eq(ordens_servico.tecnico_id, tecnicoId),
            eq(ordens_servico.status, 'em_progresso')
          )
        )

      // Versão simplificada: ordena por prioridade
      const rotaOtimizada = osDoTecnico.sort((a, b) => {
        const prioridadeMap = { alta: 3, normal: 2, baixa: 1 }
        return (prioridadeMap[b.prioridade as keyof typeof prioridadeMap] || 0) - (prioridadeMap[a.prioridade as keyof typeof prioridadeMap] || 0)
      })

      return rotaOtimizada
    } catch (error) {
      logger.error('RoteamentoService', 'otimizarRotaTecnicos', error)
      throw error
    }
  }

  async alertaSLA(userId: string) {
    try {
      logger.info('RoteamentoService', 'alertaSLA', { userId })

      const agora = new Date()
      const alertas = []

      const osAbertas = await db
        .select()
        .from(ordens_servico)
        .where(
          and(
            eq(ordens_servico.userId, userId),
            lt(ordens_servico.status, 'finalizado')
          )
        )

      for (const os of osAbertas) {
        if (os.data_prevista) {
          const diasAte = Math.floor((os.data_prevista.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24))

          if (diasAte <= 1 && diasAte > 0) {
            alertas.push({
              osId: os.id,
              numero: os.numero,
              alerta: 'CRÍTICO - Vence em menos de 24h',
              diasRestantes: diasAte,
            })
          } else if (diasAte <= 3 && diasAte > 0) {
            alertas.push({
              osId: os.id,
              numero: os.numero,
              alerta: 'ATENÇÃO - Vence em ' + diasAte + ' dias',
              diasRestantes: diasAte,
            })
          }
        }
      }

      return alertas
    } catch (error) {
      logger.error('RoteamentoService', 'alertaSLA', error)
      throw error
    }
  }
}

export const roteamentoService = new RoteamentoService()
