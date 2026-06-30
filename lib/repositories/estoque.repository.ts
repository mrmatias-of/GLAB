import { db } from '@/lib/db'
import { estoque, movimentacao_estoque } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export class EstoqueRepository {
  async criar(dados: any) {
    const result = await db.insert(estoque).values(dados).returning()
    return result[0]
  }

  async obter(id: number, userId: string) {
    const result = await db
      .select()
      .from(estoque)
      .where(and(eq(estoque.id, id), eq(estoque.userId, userId)))
    return result[0] || null
  }

  async listar(userId: string, filtros: any = {}) {
    let query = db.select().from(estoque).where(eq(estoque.userId, userId))

    if (filtros.categoria) {
      query = query.where(eq(estoque.categoria, filtros.categoria))
    }
    if (filtros.ativo !== undefined) {
      query = query.where(eq(estoque.ativo, filtros.ativo))
    }

    return query
  }

  async atualizar(id: number, userId: string, dados: any) {
    const result = await db
      .update(estoque)
      .set({ ...dados, updatedAt: new Date() })
      .where(and(eq(estoque.id, id), eq(estoque.userId, userId)))
      .returning()
    return result[0] || null
  }

  async deletar(id: number, userId: string) {
    await db
      .delete(estoque)
      .where(and(eq(estoque.id, id), eq(estoque.userId, userId)))
  }

  async verificarEstoqueBaixo(userId: string) {
    return await db
      .select()
      .from(estoque)
      .where(
        and(
          eq(estoque.userId, userId),
          eq(estoque.ativo, true)
        )
      )
      .then(items => 
        items.filter(item => 
          item.quantidade_atual && item.quantidade_minima &&
          item.quantidade_atual <= item.quantidade_minima
        )
      )
  }

  async registrarMovimentacao(dados: any) {
    const result = await db.insert(movimentacao_estoque).values(dados).returning()
    return result[0]
  }

  async obterMovimentacoes(userId: string, estoqueId?: number) {
    let query = db.select().from(movimentacao_estoque).where(eq(movimentacao_estoque.userId, userId))

    if (estoqueId) {
      query = query.where(eq(movimentacao_estoque.estoque_id, estoqueId))
    }

    return query
  }
}

export const estoqueRepository = new EstoqueRepository()
