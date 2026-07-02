import { MultiTenantRepository } from '../repositories/multi-tenant.repository'
import { logger } from '@/lib/utils/logger'
import { AppError } from '@/src/shared/errors/app.error'

/**
 * Multi-Tenant Service
 * Enforces data isolation and tenant-scoped access control
 */
export class MultiTenantService {
  private repository: MultiTenantRepository

  constructor() {
    this.repository = new MultiTenantRepository()
  }

  /**
   * Discover tenant from multiple sources
   */
  async discoverTenant(input: {
    tenantId?: string
    tenantSlug?: string
    subdomain?: string
  }) {
    // 1. Try exact ID
    if (input.tenantId) {
      const tenant = await this.repository.findTenantById(input.tenantId)
      if (tenant) return tenant
    }

    // 2. Try slug
    if (input.tenantSlug) {
      const tenant = await this.repository.findTenantBySlug(input.tenantSlug)
      if (tenant) return tenant
    }

    // 3. Try subdomain
    if (input.subdomain) {
      const tenant = await this.repository.findTenantBySlug(input.subdomain)
      if (tenant) return tenant
    }

    throw AppError.NotFound('Tenant')
  }

  /**
   * Enforce tenant access - CRITICAL for security
   * Call this at the start of every request that accesses tenant data
   */
  async enforceTenantAccess(userId: string, tenantId: string, resource: string) {
    logger.info('MultiTenantService', 'Enforcing tenant access', {
      userId,
      tenantId,
      resource,
    })

    const result = await this.repository.enforceRowLevelSecurity(
      userId,
      tenantId,
      resource
    )

    if (!result.allowed) {
      throw AppError.Forbidden(result.error)
    }

    return true
  }

  /**
   * Get user's accessible tenants
   */
  async getUserTenants(userId: string) {
    return await this.repository.getUserTenants(userId)
  }

  /**
   * Create tenant for organization
   */
  async createTenant(data: {
    name: string
    slug: string
    ownerId: string
    plan?: string
  }) {
    logger.info('MultiTenantService', 'Creating tenant', {
      name: data.name,
      slug: data.slug,
      ownerId: data.ownerId,
    })

    const tenantId = `tenant_${Date.now()}`

    const tenant = await this.repository.createTenant({
      id: tenantId,
      name: data.name,
      slug: data.slug,
      plan: data.plan || 'starter',
      maxUsers: 5,
    })

    return tenant[0]
  }

  /**
   * Verify tenant-scoped data access
   * Use in repositories before returning data
   */
  async verifyTenantDataAccess(
    userId: string,
    tenantId: string,
    dataOwnerId: string,
    dataOwnedByTenant: boolean = true
  ) {
    // Verify user has access to tenant
    const hasAccess = await this.repository.verifyUserTenantAccess(userId, tenantId)

    if (!hasAccess) {
      return false
    }

    // If data is tenant-scoped, it's already isolated
    if (dataOwnedByTenant) {
      return true
    }

    // If data is user-scoped, verify ownership
    return userId === dataOwnerId
  }
}

export const multiTenantService = new MultiTenantService()
