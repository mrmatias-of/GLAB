import { db } from '@/lib/db'
import { financeiro, alocacao_tecnicos } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

/**
 * Comissão Repository
 * Handles commission/comissão records and calculations
 * Comissões are stored in the financeiro table with tipo = 'comissao'
 */
export class ComissaoRepository {
  async obter(id: number, userId: string) {
    return await db.query.financeiro.findFirst({
      where: and(
        eq(financeiro.id, id),
        eq(financeiro.userId, userId),
        // TODO: Filter by tipo = 'comissao'
      ),
    })
  }

  async listarPorTecnico(userId: string, tecnicoId: number, dataInicio?: Date, dataFim?: Date) {
    return await db.query.financeiro.findMany({
      where: and(
        eq(financeiro.userId, userId),
        eq(financeiro.tecnico_id, tecnicoId),
        // TODO: Filter by tipo = 'comissao'
      ),
    })
  }

  async listarTodas(userId: string, dataInicio?: Date, dataFim?: Date) {
    return await db.query.financeiro.findMany({
      where: and(
        eq(financeiro.userId, userId),
        // TODO: Filter by tipo = 'comissao'
      ),
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

  async obterAlocacoes(userId: string, osId?: number) {
    return await db.query.alocacao_tecnicos.findMany({
      where: eq(alocacao_tecnicos.userId, userId),
    })
  }

  async getTotalComissaoPorTecnico(userId: string, tecnicoId: number) {
    // TODO: Sum all comissoes for this technician
    const comissoes = await this.listarPorTecnico(userId, tecnicoId)
    return comissoes.reduce((acc: number, c: any) => acc + (c.valor || 0), 0)
  }

  async getTotalComissoesPendentes(userId: string) {
    // TODO: Sum all pending comissoes
    const comissoes = await this.listarTodas(userId)
    return comissoes
      .filter((c: any) => c.status === 'pendente')
      .reduce((acc: number, c: any) => acc + (c.valor || 0), 0)
  }
}
