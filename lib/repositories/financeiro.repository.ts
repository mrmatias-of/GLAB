import { db } from '@/lib/db'
import { financeiro } from '@/lib/db/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

export class FinanceiroRepository {
  async criar(dados: any) {
    const result = await db.insert(financeiro).values(dados).returning()
    return result[0]
  }

  async obter(id: number, userId: string) {
    const result = await db
      .select()
      .from(financeiro)
      .where(and(eq(financeiro.id, id), eq(financeiro.userId, userId)))
    return result[0] || null
  }

  async listar(userId: string, filtros: any = {}) {
    let query = db.select().from(financeiro).where(eq(financeiro.userId, userId))

    if (filtros.tipo) {
      query = query.where(eq(financeiro.tipo, filtros.tipo))
    }
    if (filtros.status) {
      query = query.where(eq(financeiro.status, filtros.status))
    }
    if (filtros.dataInicio && filtros.dataFim) {
      query = query.where(
        and(
          gte(financeiro.data, filtros.dataInicio),
          lte(financeiro.data, filtros.dataFim)
        )
      )
    }

    return query
  }

  async atualizar(id: number, userId: string, dados: any) {
    const result = await db
      .update(financeiro)
      .set({ ...dados, updatedAt: new Date() })
      .where(and(eq(financeiro.id, id), eq(financeiro.userId, userId)))
      .returning()
    return result[0] || null
  }

  async deletar(id: number, userId: string) {
    await db
      .delete(financeiro)
      .where(and(eq(financeiro.id, id), eq(financeiro.userId, userId)))
  }

  async obterReceitas(userId: string, dataInicio?: Date, dataFim?: Date) {
    let query = db
      .select()
      .from(financeiro)
      .where(and(eq(financeiro.userId, userId), eq(financeiro.tipo, 'receita')))

    if (dataInicio && dataFim) {
      query = query.where(
        and(
          gte(financeiro.data, dataInicio),
          lte(financeiro.data, dataFim)
        )
      )
    }

    return query
  }

  async obterDespesas(userId: string, dataInicio?: Date, dataFim?: Date) {
    let query = db
      .select()
      .from(financeiro)
      .where(and(eq(financeiro.userId, userId), eq(financeiro.tipo, 'despesa')))

    if (dataInicio && dataFim) {
      query = query.where(
        and(
          gte(financeiro.data, dataInicio),
          lte(financeiro.data, dataFim)
        )
      )
    }

    return query
  }
}

export const financeiroRepository = new FinanceiroRepository()
