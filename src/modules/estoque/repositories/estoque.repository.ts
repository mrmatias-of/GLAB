import { db } from '@/lib/db'
import { estoque } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export class EstoqueRepository {
  async findById(id: number, tenantId: string) {
    return db.query.estoque.findFirst({
      where: and(eq(estoque.id, id), eq(estoque.tenantId, tenantId)),
    })
  }

  async findAll(tenantId: string) {
    return db.query.estoque.findMany({
      where: eq(estoque.tenantId, tenantId),
    })
  }

  async create(data: any) {
    return db.insert(estoque).values(data).returning()
  }

  async update(id: number, tenantId: string, data: any) {
    return db
      .update(estoque)
      .set(data)
      .where(and(eq(estoque.id, id), eq(estoque.tenantId, tenantId)))
      .returning()
  }
}
