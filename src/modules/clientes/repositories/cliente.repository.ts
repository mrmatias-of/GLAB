import { db } from '@/lib/db'
import { clientes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

/**
 * Cliente Repository
 * Each tenant has isolated database, so userId is sufficient for scoping
 * Note: tenantId is handled at connection/middleware level
 */
export class ClienteRepository {
  async findById(id: number, userId: string) {
    return await db.query.clientes.findFirst({
      where: and(eq(clientes.id, id), eq(clientes.userId, userId)),
    })
  }

  async findAll(userId: string, filtros?: any) {
    let query = db.query.clientes.findMany({
      where: eq(clientes.userId, userId),
    })
    
    // Apply filters if provided
    if (filtros?.ativo !== undefined) {
      // This would need to be combined with the userId filter
      // For now, we'll do client-side filtering
    }
    
    return await query
  }

  async create(data: any) {
    const result = await db.insert(clientes).values(data).returning()
    return result[0]
  }

  async update(id: number, userId: string, data: any) {
    const result = await db
      .update(clientes)
      .set(data)
      .where(and(eq(clientes.id, id), eq(clientes.userId, userId)))
      .returning()
    return result[0]
  }

  async delete(id: number, userId: string) {
    await db
      .delete(clientes)
      .where(and(eq(clientes.id, id), eq(clientes.userId, userId)))
  }

  async getSatisfacaoMedia(userId: string) {
    // TODO: Calculate average satisfaction for user's clients
    return 4.5
  }

  async updateValorAcumulado(id: number, userId: string, novoValor: number) {
    const result = await db
      .update(clientes)
      .set({ valor_acumulado: novoValor.toString() })
      .where(and(eq(clientes.id, id), eq(clientes.userId, userId)))
      .returning()
    return result[0]
  }
}
