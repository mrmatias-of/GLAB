/**
 * Shared Types - Tipos comuns em todos os módulos
 */

export type TenantContext = {
  tenantId: string
  userId: string
  email?: string
}

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type PaginatedResponse<T = any> = {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export type ServiceResult<T = any> = {
  ok: boolean
  data?: T
  error?: string
}

export interface BaseEntity {
  id: string | number
  tenantId: string
  createdAt?: Date
  updatedAt?: Date
}

export type Module = 'auth' | 'master' | 'clientes' | 'ordens' | 'estoque' | 'financeiro' | 'rh'

export type FeatureFlagKey = 
  | 'crm'
  | 'agenda'
  | 'compras'
  | 'laboratorio'
  | 'garantias'
  | 'fiscal'
  | 'whatsapp'
  | 'telegram'
  | 'api'
  | 'bi'
  | 'marketplace'
