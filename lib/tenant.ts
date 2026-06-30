import { cookies } from 'next/headers'
import { db } from './db'
import { tenants, tenantBranding } from './db/schema'
import { eq } from 'drizzle-orm'

export interface TenantConfig {
  id: string
  slug: string
  name: string
  email: string
  plan: string
  status: string
  ownerUserId: string
  branding?: {
    logoUrl?: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
    theme: 'dark' | 'light'
    favicon?: string
  }
}

/**
 * Get the current tenant from the URL slug
 * Reads from the URL path: /{tenantSlug}/...
 */
export async function getCurrentTenant(tenantSlug: string): Promise<TenantConfig | null> {
  try {
    // Buscar tenant no banco
    const tenantRecord = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, tenantSlug))
      .limit(1)

    if (tenantRecord.length === 0) {
      console.error(`[Tenant] Tenant not found: ${tenantSlug}`)
      return null
    }

    const tenant = tenantRecord[0]

    // Buscar branding do tenant
    const brandingRecord = await db
      .select()
      .from(tenantBranding)
      .where(eq(tenantBranding.tenantId, tenant.id))
      .limit(1)

    const branding = brandingRecord[0] || {
      primaryColor: '#3B82F6',
      secondaryColor: '#06B6D4',
      accentColor: '#10B981',
      backgroundColor: '#0B0F19',
      textColor: '#F1F5F9',
      theme: 'dark',
    }

    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      email: tenant.email,
      plan: tenant.plan,
      status: tenant.status,
      ownerUserId: tenant.ownerUserId,
      branding: {
        logoUrl: branding.logoUrl || undefined,
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        accentColor: branding.accentColor,
        backgroundColor: branding.backgroundColor,
        textColor: branding.textColor,
        theme: branding.theme as 'dark' | 'light',
        favicon: branding.favicon || undefined,
      },
    }
  } catch (error) {
    console.error('[Tenant] Error fetching tenant:', error)
    return null
  }
}

/**
 * Get all tenants for an admin user (admin@glabcursos.com.br)
 */
export async function getAllTenants(adminUserId: string) {
  try {
    // Se for admin geral, retorna todos os tenants
    // Caso contrário, retorna apenas os tenants do usuário
    const result = await db
      .select()
      .from(tenants)
      .where(eq(tenants.ownerUserId, adminUserId))

    return result
  } catch (error) {
    console.error('[Tenant] Error fetching tenants:', error)
    return []
  }
}

/**
 * Create a new tenant
 */
export async function createTenant(data: {
  slug: string
  name: string
  email: string
  ownerUserId: string
  databaseUrl: string
  databaseName: string
  plan?: string
}) {
  try {
    const id = `tenant_${Date.now()}_${Math.random().toString(36).slice(2)}`

    const result = await db
      .insert(tenants)
      .values({
        id,
        slug: data.slug,
        name: data.name,
        email: data.email,
        ownerUserId: data.ownerUserId,
        databaseUrl: data.databaseUrl,
        databaseName: data.databaseName,
        plan: data.plan || 'free',
        status: 'active',
      })
      .returning()

    // Create default branding
    const brandingId = `branding_${Date.now()}_${Math.random().toString(36).slice(2)}`
    await db.insert(tenantBranding).values({
      id: brandingId,
      tenantId: id,
      primaryColor: '#3B82F6',
      secondaryColor: '#06B6D4',
      accentColor: '#10B981',
      backgroundColor: '#0B0F19',
      textColor: '#F1F5F9',
      theme: 'dark',
    })

    return result[0] || null
  } catch (error) {
    console.error('[Tenant] Error creating tenant:', error)
    return null
  }
}

/**
 * Update tenant branding
 */
export async function updateTenantBranding(
  tenantId: string,
  branding: Partial<typeof tenantBranding.$inferInsert>
) {
  try {
    const result = await db
      .update(tenantBranding)
      .set(branding)
      .where(eq(tenantBranding.tenantId, tenantId))
      .returning()

    return result[0] || null
  } catch (error) {
    console.error('[Tenant] Error updating branding:', error)
    return null
  }
}

/**
 * Update tenant plan (only by admin)
 */
export async function updateTenantPlan(tenantId: string, plan: string) {
  try {
    const result = await db
      .update(tenants)
      .set({ plan })
      .where(eq(tenants.id, tenantId))
      .returning()

    return result[0] || null
  } catch (error) {
    console.error('[Tenant] Error updating plan:', error)
    return null
  }
}

/**
 * Suspend a tenant (only by admin)
 */
export async function suspendTenant(tenantId: string) {
  try {
    const result = await db
      .update(tenants)
      .set({ status: 'suspended' })
      .where(eq(tenants.id, tenantId))
      .returning()

    return result[0] || null
  } catch (error) {
    console.error('[Tenant] Error suspending tenant:', error)
    return null
  }
}

/**
 * Delete a tenant (soft delete)
 */
export async function deleteTenant(tenantId: string) {
  try {
    const result = await db
      .update(tenants)
      .set({
        status: 'deleted',
        deletedAt: new Date(),
      })
      .where(eq(tenants.id, tenantId))
      .returning()

    return result[0] || null
  } catch (error) {
    console.error('[Tenant] Error deleting tenant:', error)
    return null
  }
}
