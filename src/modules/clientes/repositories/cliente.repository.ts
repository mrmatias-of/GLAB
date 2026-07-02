import { db } from '@/lib/db'
import { clientes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export class ClienteRepository {
  async findById(id: number, tenantId: string) {
    return db.query.clientes.findFirst({
      where: and(eq(clientes.id, id), eq(clientes.tenantId, tenantId)),
    })
  }

  async findAll(tenantId: string) {
    return db.query.clientes.findMany({
      where: eq(clientes.tenantId, tenantId),
    })
  }

  async create(data: any) {
    return db.insert(clientes).values(data).returning()
  }

  async update(id: number, tenantId: string, data: any) {
    return db
      .update(clientes)
      .set(data)
      .where(and(eq(clientes.id, id), eq(clientes.tenantId, tenantId)))
      .returning()
  }

  async delete(id: number, tenantId: string) {
    return db
      .delete(clientes)
      .where(and(eq(clientes.id, id), eq(clientes.tenantId, tenantId)))
  }
}
