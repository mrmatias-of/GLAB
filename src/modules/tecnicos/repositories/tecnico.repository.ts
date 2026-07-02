import { db } from '@/lib/db'
import { tecnicos } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export class TecnicoRepository {
  async obter(id: number, userId: string) {
    return await db.query.tecnicos.findFirst({
      where: and(eq(tecnicos.id, id), eq(tecnicos.userId, userId)),
    })
  }

  async listar(userId: string, filtros?: any) {
    return await db.query.tecnicos.findMany({
      where: eq(tecnicos.userId, userId),
    })
  }

  async criar(data: any) {
    const result = await db.insert(tecnicos).values(data).returning()
    return result[0]
  }

  async atualizar(id: number, userId: string, data: any) {
    const result = await db
      .update(tecnicos)
      .set(data)
      .where(and(eq(tecnicos.id, id), eq(tecnicos.userId, userId)))
      .returning()
    return result[0]
  }

  async deletar(id: number, userId: string) {
    await db
      .delete(tecnicos)
      .where(and(eq(tecnicos.id, id), eq(tecnicos.userId, userId)))
  }

  async obterAtivos(userId: string) {
    return await db.query.tecnicos.findMany({
      where: and(
        eq(tecnicos.userId, userId),
        // TODO: Filter by status = 'ativo'
      ),
    })
  }

  async obterPorEspecialidade(userId: string, especialidade: string) {
    return await db.query.tecnicos.findMany({
      where: and(
        eq(tecnicos.userId, userId),
        // TODO: Filter by especialidade
      ),
    })
  }

  async atualizarRating(id: number, userId: string, novoRating: number) {
    return await this.atualizar(id, userId, { rating: novoRating })
  }

  async atualizarOsConcluidas(id: number, userId: string, quantidade: number) {
    const tecnico = await this.obter(id, userId)
    if (!tecnico) return null
    
    const novaQuantidade = (tecnico.os_concluidas || 0) + quantidade
    return await this.atualizar(id, userId, { os_concluidas: novaQuantidade })
  }

  async atualizarLocalizacao(id: number, userId: string, latitude: number, longitude: number) {
    return await this.atualizar(id, userId, { latitude, longitude })
  }
}
