import { db } from '@/lib/db'
import { user, tenants } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

/**
 * Multi-Tenant Repository
 * Handles tenant discovery, validation, and row-level security
 */
export class MultiTenantRepository {
  /**
   * Find tenant by ID
   */
  async findTenantById(tenantId: string) {
    return await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId),
    })
  }

  /**
   * Find tenant by slug
   */
  async findTenantBySlug(slug: string) {
    return await db.query.tenants.findFirst({
      where: eq(tenants.slug, slug),
    })
  }

  /**
   * Verify user belongs to tenant
   * Row-Level Security check
   */
  async verifyUserTenantAccess(userId: string, tenantId: string): Promise<boolean> {
    const userRecord = await db.query.user.findFirst({
      where: and(
        eq(user.id, userId),
        eq(user.tenantId, tenantId)
      ),
    })

    return !!userRecord
  }

  /**
   * Get user's tenants
   */
  async getUserTenants(userId: string) {
    return await db.query.user.findMany({
      where: eq(user.id, userId),
      columns: {
        tenantId: true,
      },
    })
  }

  /**
   * Create new tenant
   */
  async createTenant(data: {
    id: string
    name: string
    slug: string
    plan: string
    maxUsers: number
  }) {
    return await db.insert(tenants).values(data).returning()
  }

  /**
   * Update tenant
   */
  async updateTenant(tenantId: string, data: any) {
    return await db
      .update(tenants)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tenants.id, tenantId))
      .returning()
  }

  /**
   * Check if user can access resource based on tenant
   * This is used before any data access
   */
  async enforceRowLevelSecurity(userId: string, tenantId: string, resource: string): Promise<{
    allowed: boolean
    error?: string
  }> {
    try {
      const hasAccess = await this.verifyUserTenantAccess(userId, tenantId)
      
      if (!hasAccess) {
        return {
          allowed: false,
          error: `User does not have access to ${resource} in tenant ${tenantId}`,
        }
      }

      const tenant = await this.findTenantById(tenantId)
      if (!tenant) {
        return {
          allowed: false,
          error: `Tenant ${tenantId} not found`,
        }
      }

      return { allowed: true }
    } catch (error) {
      console.error('RLS check failed:', error)
      return {
        allowed: false,
        error: 'Security check failed',
      }
    }
  }

  /**
   * Build tenant filter for queries
   * Ensures queries only return data for specified tenant
   */
  buildTenantFilter(tableName: string, tenantId: string) {
    // This is a utility to help construct WHERE clauses
    // Usage: WHERE tenantId = ? AND ...
    return { tenantId }
  }
}

export const multiTenantRepository = new MultiTenantRepository()
