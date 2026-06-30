import { db } from '@/lib/db'
import { servicos } from '@/lib/db/schema'
import { eq, and, ilike } from 'drizzle-orm'

export class ServicosRepository {
  async findByUserId(userId: string) {
    return await db
      .select()
      .from(servicos)
      .where(eq(servicos.userId, userId))
      .orderBy(servicos.createdAt)
  }

  async findById(userId: string, id: number) {
    const result = await db
      .select()
      .from(servicos)
      .where(and(eq(servicos.id, id), eq(servicos.userId, userId)))
    return result[0] || null
  }

  async findByNome(userId: string, nome: string) {
    return await db
      .select()
      .from(servicos)
      .where(and(ilike(servicos.nome, `%${nome}%`), eq(servicos.userId, userId)))
  }

  async create(userId: string, data: any) {
    const result = await db
      .insert(servicos)
      .values({
        userId,
        nome: data.nome,
        descricao: data.descricao,
        valor_padrao: data.valor_padrao,
        tempo_estimado_minutos: data.tempo_estimado_minutos,
      })
      .returning()
    return result[0]
  }

  async update(userId: string, id: number, data: any) {
    const result = await db
      .update(servicos)
      .set({
        nome: data.nome,
        descricao: data.descricao,
        valor_padrao: data.valor_padrao,
        tempo_estimado_minutos: data.tempo_estimado_minutos,
        updatedAt: new Date(),
      })
      .where(and(eq(servicos.id, id), eq(servicos.userId, userId)))
      .returning()
    return result[0] || null
  }

  async delete(userId: string, id: number) {
    const result = await db
      .delete(servicos)
      .where(and(eq(servicos.id, id), eq(servicos.userId, userId)))
      .returning()
    return result[0] || null
  }
}

export const servicosRepository = new ServicosRepository()
