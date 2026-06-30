import type { IRepository } from '@/lib/repositories/base.repository'

export interface IService<T> {
  getAll(limit?: number, offset?: number): Promise<T[]>
  getById(id: string): Promise<T | null>
  create(data: Partial<T>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T | null>
  delete(id: string): Promise<boolean>
  count(): Promise<number>
}

export abstract class BaseService<T> implements IService<T> {
  protected repository: IRepository<T>

  constructor(repository: IRepository<T>) {
    this.repository = repository
  }

  async getAll(limit = 100, offset = 0): Promise<T[]> {
    try {
      return await this.repository.findAll(limit, offset)
    } catch (error) {
      console.error(`[Service] Error fetching all:`, error)
      throw error
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      if (!id) throw new Error('ID is required')
      return await this.repository.findById(id)
    } catch (error) {
      console.error(`[Service] Error finding by ID:`, error)
      throw error
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      if (!data) throw new Error('Data is required')
      return await this.repository.create(data)
    } catch (error) {
      console.error(`[Service] Error creating:`, error)
      throw error
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      if (!id) throw new Error('ID is required')
      if (!data) throw new Error('Data is required')
      return await this.repository.update(id, data)
    } catch (error) {
      console.error(`[Service] Error updating:`, error)
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!id) throw new Error('ID is required')
      return await this.repository.delete(id)
    } catch (error) {
      console.error(`[Service] Error deleting:`, error)
      throw error
    }
  }

  async count(): Promise<number> {
    try {
      return await this.repository.count()
    } catch (error) {
      console.error(`[Service] Error counting:`, error)
      throw error
    }
  }
}
