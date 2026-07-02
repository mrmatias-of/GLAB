import { db } from '@/lib/db'
import { ordens_servico } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export class OrdemRepository {
  async findById(id: number, userId: string) {
    return await db.query.ordens_servico.findFirst({
      where: and(eq(ordens_servico.id, id), eq(ordens_servico.userId, userId)),
    })
  }

  async findAll(userId: string, filtros?: any) {
    return await db.query.ordens_servico.findMany({
      where: eq(ordens_servico.userId, userId),
    })
  }

  async findByStatus(userId: string, status: string) {
    return await db.query.ordens_servico.findMany({
      where: and(
        eq(ordens_servico.userId, userId),
        eq(ordens_servico.status, status),
      ),
    })
  }

  async create(userId: string, data: any) {
    const result = await db.insert(ordens_servico).values({ ...data, userId }).returning()
    return result[0]
  }

  async update(id: number, userId: string, data: any) {
    const result = await db
      .update(ordens_servico)
      .set(data)
      .where(and(eq(ordens_servico.id, id), eq(ordens_servico.userId, userId)))
      .returning()
    return result[0]
  }

  async updateStatus(id: number, userId: string, novoStatus: string) {
    const result = await db
      .update(ordens_servico)
      .set({ status: novoStatus })
      .where(and(eq(ordens_servico.id, id), eq(ordens_servico.userId, userId)))
      .returning()
    return result[0]
  }

  async getStatusCounts(userId: string) {
    // TODO: Get counts by status
    return { aberto: 0, em_progresso: 0, pausado: 0, finalizado: 0, cancelado: 0 }
  }

  async getProximasVencer(userId: string) {
    // TODO: Get orders closest to due date
    return []
  }
}
