import { eq, and, desc, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ordens_servico } from '@/lib/db/schema'
import { BaseRepository } from './base.repository'

export class OrdemRepository extends BaseRepository {
  async create(userId: string, data: any) {
    const result = await db
      .insert(ordens_servico)
      .values({
        ...data,
        userId,
        numero: `OS-${Date.now()}`,
      })
      .returning()

    return result[0]
  }

  async findById(id: number, userId: string) {
    return await db.query.ordens_servico.findFirst({
      where: and(eq(ordens_servico.id, id), eq(ordens_servico.userId, userId)),
    })
  }

  async findAll(userId: string, filters?: { status?: string; clienteId?: number; tecnicoId?: number }) {
    let whereClause = eq(ordens_servico.userId, userId)

    if (filters?.status) {
      whereClause = and(whereClause, eq(ordens_servico.status, filters.status))
    }
    if (filters?.clienteId) {
      whereClause = and(whereClause, eq(ordens_servico.cliente_id, filters.clienteId))
    }

    return await db.query.ordens_servico.findMany({
      where: whereClause,
      orderBy: desc(ordens_servico.data_abertura),
    })
  }

  async findByStatus(userId: string, status: string) {
    return await db.query.ordens_servico.findMany({
      where: and(eq(ordens_servico.userId, userId), eq(ordens_servico.status, status)),
    })
  }

  async update(id: number, userId: string, data: any) {
    return await db
      .update(ordens_servico)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(ordens_servico.id, id), eq(ordens_servico.userId, userId)))
      .returning()
  }

  async updateStatus(id: number, userId: string, status: string) {
    return await db
      .update(ordens_servico)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(ordens_servico.id, id), eq(ordens_servico.userId, userId)))
      .returning()
  }

  async getStatusCounts(userId: string) {
    const ordens = await db.query.ordens_servico.findMany({
      where: eq(ordens_servico.userId, userId),
    })

    const counts = {
      aberto: 0,
      em_progresso: 0,
      pausado: 0,
      finalizado: 0,
      cancelado: 0,
    }

    ordens.forEach((o) => {
      if (o.status === 'aberto') counts.aberto++
      if (o.status === 'em_progresso') counts.em_progresso++
      if (o.status === 'pausado') counts.pausado++
      if (o.status === 'finalizado') counts.finalizado++
      if (o.status === 'cancelado') counts.cancelado++
    })

    return counts
  }

  async getProximasVencer(userId: string, diasAntecipacao = 3) {
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() + diasAntecipacao)

    return await db.query.ordens_servico.findMany({
      where: and(
        eq(ordens_servico.userId, userId),
        eq(ordens_servico.status, 'aberto')
      ),
    }).then(ordens =>
      ordens.filter(o => 
        o.data_prevista && new Date(o.data_prevista) <= dataLimite
      )
    )
  }
}
