import { eq, and, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { tecnicos } from '@/lib/db/schema'
import { BaseRepository } from './base.repository'

export class TecnicoRepository extends BaseRepository {
  async create(userId: string, data: any) {
    const result = await db
      .insert(tecnicos)
      .values({
        ...data,
        userId,
      })
      .returning()

    return result[0]
  }

  async findById(id: number, userId: string) {
    return await db.query.tecnicos.findFirst({
      where: and(eq(tecnicos.id, id), eq(tecnicos.userId, userId)),
    })
  }

  async findAll(userId: string, filters?: { status?: string; especialidade?: string }) {
    let whereClause = eq(tecnicos.userId, userId)

    if (filters?.status) {
      whereClause = and(whereClause, eq(tecnicos.status, filters.status))
    }
    if (filters?.especialidade) {
      whereClause = and(whereClause, eq(tecnicos.especialidade, filters.especialidade))
    }

    return await db.query.tecnicos.findMany({
      where: whereClause,
      orderBy: desc(tecnicos.createdAt),
    })
  }

  async findAtivos(userId: string) {
    return await db.query.tecnicos.findMany({
      where: and(eq(tecnicos.userId, userId), eq(tecnicos.status, 'ativo')),
    })
  }

  async update(id: number, userId: string, data: any) {
    return await db
      .update(tecnicos)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(tecnicos.id, id), eq(tecnicos.userId, userId)))
      .returning()
  }

  async updateLocalizacao(id: number, userId: string, latitude: number, longitude: number) {
    return await db
      .update(tecnicos)
      .set({ latitude, longitude })
      .where(and(eq(tecnicos.id, id), eq(tecnicos.userId, userId)))
      .returning()
  }

  async getTop5Produtivos(userId: string) {
    const tecnicos_list = await db.query.tecnicos.findMany({
      where: eq(tecnicos.userId, userId),
      orderBy: desc(tecnicos.os_concluidas),
    })

    return tecnicos_list.slice(0, 5)
  }

  async getMediaRating(userId: string) {
    const result = await db.query.tecnicos.findMany({
      where: eq(tecnicos.userId, userId),
    })

    if (result.length === 0) return 0

    const total = result.reduce((acc, t) => acc + (parseFloat(t.rating) || 0), 0)
    return (total / result.length).toFixed(2)
  }
}
