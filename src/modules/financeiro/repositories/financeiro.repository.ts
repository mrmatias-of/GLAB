import { db } from '@/lib/db'
import { financeiro } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export class FinanceiroRepository {
  async obter(id: number, userId: string) {
    return await db.query.financeiro.findFirst({
      where: and(eq(financeiro.id, id), eq(financeiro.userId, userId)),
    })
  }

  async listar(userId: string, filtros?: any) {
    return await db.query.financeiro.findMany({
      where: eq(financeiro.userId, userId),
    })
  }

  async criar(data: any) {
    const result = await db.insert(financeiro).values(data).returning()
    return result[0]
  }

  async atualizar(id: number, userId: string, data: any) {
    const result = await db
      .update(financeiro)
      .set(data)
      .where(and(eq(financeiro.id, id), eq(financeiro.userId, userId)))
      .returning()
    return result[0]
  }

  async deletar(id: number, userId: string) {
    await db
      .delete(financeiro)
      .where(and(eq(financeiro.id, id), eq(financeiro.userId, userId)))
  }

  async obterReceitas(userId: string, dataInicio?: Date, dataFim?: Date) {
    // TODO: Filter by tipo = 'receita' and date range
    return await db.query.financeiro.findMany({
      where: eq(financeiro.userId, userId),
    })
  }

  async obterDespesas(userId: string, dataInicio?: Date, dataFim?: Date) {
    // TODO: Filter by tipo = 'despesa' and date range
    return await db.query.financeiro.findMany({
      where: eq(financeiro.userId, userId),
    })
  }
}
