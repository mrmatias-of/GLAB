import { db } from '@/lib/db'
import { servicos } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export class ServicoRepository {
  async obter(id: number, userId: string) {
    return await db.query.servicos.findFirst({
      where: and(eq(servicos.id, id), eq(servicos.userId, userId)),
    })
  }

  async listar(userId: string, filtros?: any) {
    return await db.query.servicos.findMany({
      where: eq(servicos.userId, userId),
    })
  }

  async criar(data: any) {
    const result = await db.insert(servicos).values(data).returning()
    return result[0]
  }

  async atualizar(id: number, userId: string, data: any) {
    const result = await db
      .update(servicos)
      .set(data)
      .where(and(eq(servicos.id, id), eq(servicos.userId, userId)))
      .returning()
    return result[0]
  }

  async deletar(id: number, userId: string) {
    await db
      .delete(servicos)
      .where(and(eq(servicos.id, id), eq(servicos.userId, userId)))
  }

  async obterAtivos(userId: string) {
    return await db.query.servicos.findMany({
      where: and(
        eq(servicos.userId, userId),
        // TODO: Filter by ativo = true
      ),
    })
  }
}
