import { Database } from '@/lib/db'
import { eq, and } from 'drizzle-orm'

/**
 * Base Repository - Padrão para todos os repositories
 * Fornece CRUD genérico com tenant isolation automático
 */
export class BaseRepository<T extends Record<string, any>> {
  constructor(
    protected db: Database,
    protected tableName: string,
    protected tenantId: string,
  ) {}

  /**
   * Find all com tenant filtering
   */
  async findAll(filters?: Partial<T>) {
    return this.db.query[this.tableName as keyof typeof this.db.query].findMany({
      where: eq((this.db[this.tableName as keyof typeof this.db] as any).tenantId, this.tenantId),
    })
  }

  /**
   * Find by ID com tenant validation
   */
  async findById(id: string | number) {
    return this.db.query[this.tableName as keyof typeof this.db.query].findFirst({
      where: and(
        eq((this.db[this.tableName as keyof typeof this.db] as any).id, id),
        eq((this.db[this.tableName as keyof typeof this.db] as any).tenantId, this.tenantId),
      ),
    })
  }

  /**
   * Create com tenant injection automático
   */
  async create(data: Partial<T>) {
    return this.db.insert(this.db[this.tableName as keyof typeof this.db] as any).values({
      ...data,
      tenantId: this.tenantId,
    } as T)
  }

  /**
   * Update com tenant validation
   */
  async update(id: string | number, data: Partial<T>) {
    return this.db
      .update(this.db[this.tableName as keyof typeof this.db] as any)
      .set(data)
      .where(
        and(
          eq((this.db[this.tableName as keyof typeof this.db] as any).id, id),
          eq((this.db[this.tableName as keyof typeof this.db] as any).tenantId, this.tenantId),
        ),
      )
  }

  /**
   * Delete com tenant validation
   */
  async delete(id: string | number) {
    return this.db
      .delete(this.db[this.tableName as keyof typeof this.db] as any)
      .where(
        and(
          eq((this.db[this.tableName as keyof typeof this.db] as any).id, id),
          eq((this.db[this.tableName as keyof typeof this.db] as any).tenantId, this.tenantId),
        ),
      )
  }
}
