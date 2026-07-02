import { multiTenantService } from '../services/multi-tenant.service'
import { logger } from '@/lib/utils/logger'
import { AppError } from '@/src/shared/errors/app.error'

/**
 * Tenant Filter Utility
 * Ensures all queries are tenant-scoped
 * Usage in repositories:
 *   const data = await applyTenantFilter(db.query.clientes, userId, tenantId)
 */

/**
 * Middleware para queries - valida acesso antes de executar
 */
export async function validateTenantAccess(
  userId: string,
  tenantId: string,
  resource: string
) {
  try {
    await multiTenantService.enforceTenantAccess(userId, tenantId, resource)
    return true
  } catch (error) {
    logger.error('TenantFilter', 'Access denied', { userId, tenantId, resource, error })
    return false
  }
}

/**
 * Build WHERE clause para tenant filtering
 * Garante que apenas dados do tenant são retornados
 */
export function buildTenantClause(tenantId: string, fieldName = 'tenantId') {
  return {
    field: fieldName,
    value: tenantId,
  }
}

/**
 * Wrapper para queries que precisam de tenant filtering
 */
export async function withTenantFilter<T>(
  userId: string,
  tenantId: string,
  resource: string,
  queryFn: () => Promise<T>
): Promise<T> {
  // 1. Validate tenant access
  const hasAccess = await validateTenantAccess(userId, tenantId, resource)
  
  if (!hasAccess) {
    throw AppError.Forbidden(`No access to ${resource}`)
  }

  // 2. Execute query (which should already have tenant filter)
  try {
    return await queryFn()
  } catch (error) {
    logger.error('TenantFilter', 'Query failed', { userId, tenantId, resource, error })
    throw error
  }
}

/**
 * Audit log para tenant access
 */
export function logTenantAccess(
  userId: string,
  tenantId: string,
  action: string,
  resource: string
) {
  logger.info('TenantAudit', `${action} - ${resource}`, {
    userId,
    tenantId,
    timestamp: new Date().toISOString(),
  })
}
