import { db } from '@/lib/db'
import { funcionarios, contracheques } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export class RhRepository {
  async findFuncionarioById(id: number, tenantId: string) {
    return db.query.funcionarios.findFirst({
      where: and(eq(funcionarios.id, id), eq(funcionarios.tenantId, tenantId)),
    })
  }

  async findAllFuncionarios(tenantId: string) {
    return db.query.funcionarios.findMany({
      where: eq(funcionarios.tenantId, tenantId),
    })
  }

  async createFuncionario(data: any) {
    return db.insert(funcionarios).values(data).returning()
  }

  async findContracheques(tenantId: string) {
    return db.query.contracheques.findMany({
      where: eq(contracheques.tenantId, tenantId),
    })
  }

  async createContracheque(data: any) {
    return db.insert(contracheques).values(data).returning()
  }
}
