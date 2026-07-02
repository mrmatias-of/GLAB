import { db } from '@/lib/db'
import { funcionarios, contracheques, banco_horas } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export class FuncionarioRepository {
  async obter(id: number, userId: string) {
    return await db.query.funcionarios.findFirst({
      where: and(eq(funcionarios.id, id), eq(funcionarios.userId, userId)),
    })
  }

  async listar(userId: string, filtros?: any) {
    return await db.query.funcionarios.findMany({
      where: eq(funcionarios.userId, userId),
    })
  }

  async criar(data: any) {
    const result = await db.insert(funcionarios).values(data).returning()
    return result[0]
  }

  async atualizar(id: number, userId: string, data: any) {
    const result = await db
      .update(funcionarios)
      .set(data)
      .where(and(eq(funcionarios.id, id), eq(funcionarios.userId, userId)))
      .returning()
    return result[0]
  }

  async deletar(id: number, userId: string) {
    await db
      .delete(funcionarios)
      .where(and(eq(funcionarios.id, id), eq(funcionarios.userId, userId)))
  }

  async obterAtivos(userId: string) {
    return await db.query.funcionarios.findMany({
      where: and(
        eq(funcionarios.userId, userId),
        // TODO: Filter by status = 'ativo'
      ),
    })
  }

  async obterContracheque(id: number, userId: string, mes: number, ano: number) {
    return await db.query.contracheques.findFirst({
      where: and(
        eq(contracheques.userId, userId),
        eq(contracheques.funcionario_id, id),
        // TODO: Add mes and ano filters
      ),
    })
  }

  async obterBancoHoras(funcionarioId: number, userId: string) {
    return await db.query.banco_horas.findMany({
      where: and(
        eq(banco_horas.userId, userId),
        eq(banco_horas.funcionario_id, funcionarioId),
      ),
    })
  }
}
