// Tipos e interfaces globais

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  statusCode: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  pages: number
}

export interface ApiError {
  code: string
  message: string
  statusCode: number
  details?: Record<string, any>
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SortOptions {
  field: string
  order: SortOrder
}

export interface FilterOptions {
  [key: string]: any
}

export interface QueryOptions {
  limit?: number
  offset?: number
  sort?: SortOptions
  filter?: FilterOptions
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TECHNICIAN = 'technician',
  CLIENT = 'client',
  VIEWER = 'viewer',
}

export enum EntityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}
