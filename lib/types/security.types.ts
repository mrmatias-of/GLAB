export enum Permission {
  // Module-level
  VIEW = 'view',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  EXPORT = 'export',
  IMPORT = 'import',
  
  // Specific actions
  APPROVE = 'approve',
  REJECT = 'reject',
  ARCHIVE = 'archive',
  RESTORE = 'restore',
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
  DOWNLOAD = 'download',
  PRINT = 'print',
  SHARE = 'share',
  
  // Admin only
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_PERMISSIONS = 'manage_permissions',
  MANAGE_COMPANIES = 'manage_companies',
  VIEW_LOGS = 'view_logs',
  MANAGE_INTEGRATIONS = 'manage_integrations',
  MANAGE_SETTINGS = 'manage_settings',
}

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  TECHNICIAN = 'technician',
  CLIENT = 'client',
  VIEWER = 'viewer',
  CUSTOM = 'custom',
}

export interface RolePermission {
  roleId: string
  permission: Permission
  module?: string
  restrictedTo?: 'own' | 'department' | 'company' | 'all'
}

export interface UserRole {
  id: string
  userId: string
  companyId: string
  role: Role
  customPermissions?: Permission[]
  restrictedFields?: string[]
  restrictedTenants?: string[]
  active: boolean
  assignedAt: Date
  expiresAt?: Date
}

export interface AuditLog {
  id: string
  companyId: string
  userId: string
  action: string
  module: string
  entityId: string
  entityType: string
  changesBefore?: Record<string, any>
  changesAfter?: Record<string, any>
  ip?: string
  userAgent?: string
  browser?: string
  device?: string
  location?: string
  status: 'success' | 'failure'
  errorMessage?: string
  timestamp: Date
}

export interface AuditTrail {
  id: string
  auditLogId: string
  field: string
  oldValue: any
  newValue: any
  changeType: 'created' | 'updated' | 'deleted' | 'restored'
}

export interface TwoFactorAuth {
  id: string
  userId: string
  method: 'totp' | 'sms' | 'email'
  secret?: string
  phoneNumber?: string
  backupCodes: string[]
  verified: boolean
  enabledAt?: Date
  disabledAt?: Date
}

export interface SecuritySession {
  id: string
  userId: string
  token: string
  refreshToken: string
  expiresAt: Date
  ip: string
  userAgent: string
  browser: string
  device: string
  location: string
  active: boolean
  createdAt: Date
  lastActivityAt: Date
}

export interface DataEncryption {
  algorithm: string
  keyVersion: number
  encryptedAt: Date
  fields: string[]
}

export interface ACLPolicy {
  id: string
  name: string
  description?: string
  rules: ACLRule[]
  createdAt: Date
  updatedAt: Date
}

export interface ACLRule {
  id: string
  subject: string // userId, roleId, groupId
  action: Permission
  resource: string // module, specific resource
  effect: 'allow' | 'deny'
  conditions?: Record<string, any>
  priority: number
}
