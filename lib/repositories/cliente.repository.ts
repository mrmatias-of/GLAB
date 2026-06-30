import { eq, and, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { clientes } from '@/lib/db/schema'
import { BaseRepository } from './base.repository'

export class ClienteRepository extends BaseRepository {
  async create(userId: string, data: any) {
    const result = await db
      .insert(clientes)
      .values({
        ...data,
        userId,
      })
      .returning()

    return result[0]
  }

  async findById(id: number, userId: string) {
    return await db.query.clientes.findFirst({
      where: and(eq(clientes.id, id), eq(clientes.userId, userId)),
    })
  }

  async findByEmail(email: string, userId: string) {
    return await db.query.clientes.findFirst({
      where: and(eq(clientes.email, email), eq(clientes.userId, userId)),
    })
  }

  async findAll(userId: string, filters?: { ativo?: boolean; cidade?: string }) {
    let query = db.query.clientes.findMany({
      where: eq(clientes.userId, userId),
      orderBy: desc(clientes.createdAt),
    })

    if (filters?.ativo !== undefined) {
      query = db.query.clientes.findMany({
        where: and(eq(clientes.userId, userId), eq(clientes.ativo, filters.ativo)),
        orderBy: desc(clientes.createdAt),
      })
    }

    return await query
  }

  async update(id: number, userId: string, data: any) {
    return await db
      .update(clientes)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(clientes.id, id), eq(clientes.userId, userId)))
      .returning()
  }

  async delete(id: number, userId: string) {
    return await db
      .delete(clientes)
      .where(and(eq(clientes.id, id), eq(clientes.userId, userId)))
      .returning()
  }

  async updateValorAcumulado(id: number, userId: string, valor: number) {
    return await db
      .update(clientes)
      .set({ valor_acumulado: valor.toString() })
      .where(and(eq(clientes.id, id), eq(clientes.userId, userId)))
      .returning()
  }

  async getSatisfacaoMedia(userId: string) {
    const result = await db.query.clientes.findMany({
      where: eq(clientes.userId, userId),
    })

    if (result.length === 0) return 0

    const total = result.reduce((acc, c) => acc + (c.satisfacao || 0), 0)
    return (total / result.length).toFixed(2)
  }
}
