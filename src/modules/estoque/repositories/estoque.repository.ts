import { db } from '@/lib/db'
import { estoque, movimentacao_estoque } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export class EstoqueRepository {
  async obter(id: number, userId: string) {
    return await db.query.estoque.findFirst({
      where: and(eq(estoque.id, id), eq(estoque.userId, userId)),
    })
  }

  async listar(userId: string, filtros?: any) {
    return await db.query.estoque.findMany({
      where: eq(estoque.userId, userId),
    })
  }

  async criar(data: any) {
    const result = await db.insert(estoque).values(data).returning()
    return result[0]
  }

  async atualizar(id: number, userId: string, data: any) {
    const result = await db
      .update(estoque)
      .set(data)
      .where(and(eq(estoque.id, id), eq(estoque.userId, userId)))
      .returning()
    return result[0]
  }

  async deletar(id: number, userId: string) {
    await db
      .delete(estoque)
      .where(and(eq(estoque.id, id), eq(estoque.userId, userId)))
  }

  async verificarEstoqueBaixo(userId: string) {
    return await db.query.estoque.findMany({
      where: and(
        eq(estoque.userId, userId),
        // TODO: Add condition: quantidade_atual < quantidade_minima
      ),
    })
  }

  async obterMovimentacoes(userId: string, estoqueId?: number) {
    if (estoqueId) {
      return await db.query.movimentacao_estoque.findMany({
        where: and(
          eq(movimentacao_estoque.userId, userId),
          eq(movimentacao_estoque.estoque_id, estoqueId),
        ),
      })
    }
    return await db.query.movimentacao_estoque.findMany({
      where: eq(movimentacao_estoque.userId, userId),
    })
  }

  async registrarMovimentacao(data: any) {
    const result = await db.insert(movimentacao_estoque).values(data).returning()
    return result[0]
  }
}
