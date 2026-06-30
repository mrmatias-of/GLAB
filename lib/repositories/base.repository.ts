import { db } from '@/lib/db'
import type { PgTable } from 'drizzle-orm/pg-core'

export interface IRepository<T> {
  findAll(limit?: number, offset?: number): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: Partial<T>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T | null>
  delete(id: string): Promise<boolean>
  count(): Promise<number>
}

export abstract class BaseRepository<T> implements IRepository<T> {
  protected table: PgTable

  constructor(table: PgTable) {
    this.table = table
  }

  async findAll(limit = 100, offset = 0): Promise<T[]> {
    try {
      const result = await db.select().from(this.table).limit(limit).offset(offset)
      return result as T[]
    } catch (error) {
      console.error(`[Repository] Error fetching all from ${this.table._.name}:`, error)
      throw error
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      // Implementar em subclasses conforme necessário
      return null
    } catch (error) {
      console.error(`[Repository] Error finding by ID:`, error)
      throw error
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const result = await db.insert(this.table).values(data as any).returning()
      return result[0] as T
    } catch (error) {
      console.error(`[Repository] Error creating:`, error)
      throw error
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      // Implementar em subclasses conforme necessário
      return null
    } catch (error) {
      console.error(`[Repository] Error updating:`, error)
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Implementar em subclasses conforme necessário
      return true
    } catch (error) {
      console.error(`[Repository] Error deleting:`, error)
      throw error
    }
  }

  async count(): Promise<number> {
    try {
      const result = await db.select().from(this.table)
      return result.length
    } catch (error) {
      console.error(`[Repository] Error counting:`, error)
      throw error
    }
  }
}
