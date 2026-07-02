import { db } from '@/lib/db'
import { ordens_servico } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export class OrdemRepository {
  async findById(id: number, tenantId: string) {
    return db.query.ordens_servico.findFirst({
      where: and(eq(ordens_servico.id, id), eq(ordens_servico.tenantId, tenantId)),
    })
  }

  async findAll(tenantId: string) {
    return db.query.ordens_servico.findMany({
      where: eq(ordens_servico.tenantId, tenantId),
    })
  }

  async create(data: any) {
    return db.insert(ordens_servico).values(data).returning()
  }

  async update(id: number, tenantId: string, data: any) {
    return db
      .update(ordens_servico)
      .set(data)
      .where(and(eq(ordens_servico.id, id), eq(ordens_servico.tenantId, tenantId)))
      .returning()
  }
}
