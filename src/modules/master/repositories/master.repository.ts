import { db } from '@/lib/db'
import { companies, plans, feature_flags, subscriptions } from '@/lib/db/master-schema'
import { eq, and } from 'drizzle-orm'
import { AppError } from '@/src/shared/errors/app.error'
import type { Tenant, Plan, FeatureFlag } from '../types'

/**
 * Master Repository - Handles master layer data access
 * Manages tenants, plans, features, subscriptions
 */
export class MasterRepository {
  // Tenant operations
  async findTenantBySlug(slug: string): Promise<Tenant | null> {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.slug, slug))
      .limit(1)

    return result[0] || null
  }

  async findTenantById(id: string): Promise<Tenant | null> {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1)

    return result[0] || null
  }

  async listTenants(limit = 50, offset = 0) {
    return db.select().from(companies).limit(limit).offset(offset)
  }

  async createTenant(data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tenant> {
    const result = await db.insert(companies).values(data).returning()

    if (!result.length) {
      throw new AppError('Failed to create tenant', 'CREATE_TENANT_FAILED', 500)
    }

    return result[0]
  }

  async updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant> {
    const result = await db
      .update(companies)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning()

    if (!result.length) {
      throw new AppError('Tenant not found', 'TENANT_NOT_FOUND', 404)
    }

    return result[0]
  }

  // Plan operations
  async findPlanById(id: string): Promise<Plan | null> {
    const result = await db.select().from(plans).where(eq(plans.id, id)).limit(1)

    return result[0] || null
  }

  async listPlans() {
    return db.select().from(plans)
  }

  async createPlan(data: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plan> {
    const result = await db.insert(plans).values(data).returning()

    if (!result.length) {
      throw new AppError('Failed to create plan', 'CREATE_PLAN_FAILED', 500)
    }

    return result[0]
  }

  // Feature Flag operations
  async findFeatureFlags(planIds: string[]): Promise<FeatureFlag[]> {
    return db
      .select()
      .from(feature_flags)
      .where(and(eq(feature_flags.isActive, true)))
  }

  async checkFeature(module: string, planId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(feature_flags)
      .where(
        and(
          eq(feature_flags.module, module),
          eq(feature_flags.isActive, true)
        )
      )
      .limit(1)

    return !!result.length
  }

  async createFeatureFlag(data: Omit<FeatureFlag, 'id' | 'createdAt' | 'updatedAt'>): Promise<FeatureFlag> {
    const result = await db.insert(feature_flags).values(data).returning()

    if (!result.length) {
      throw new AppError('Failed to create feature flag', 'CREATE_FEATURE_FAILED', 500)
    }

    return result[0]
  }

  // Subscription operations
  async findSubscription(tenantId: string) {
    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.tenantId, tenantId))
      .limit(1)

    return result[0] || null
  }

  async createSubscription(data: any) {
    return db.insert(subscriptions).values(data).returning()
  }
}
