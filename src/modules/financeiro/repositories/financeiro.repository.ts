import { db } from '@/lib/db'
import { vendas } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export class FinanceiroRepository {
  async findById(id: number, tenantId: string) {
    return db.query.vendas.findFirst({
      where: and(eq(vendas.id, id), eq(vendas.tenantId, tenantId)),
    })
  }

  async findAll(tenantId: string) {
    return db.query.vendas.findMany({
      where: eq(vendas.tenantId, tenantId),
    })
  }

  async create(data: any) {
    return db.insert(vendas).values(data).returning()
  }
}
