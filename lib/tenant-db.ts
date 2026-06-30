import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { cache } from 'react'

// Cache de conexões de banco de dados por tenant para evitar reconexões
const dbConnections = new Map<string, PostgresJsDatabase>()

/**
 * Get ou cria conexão com o banco de dados do tenant
 * Usa cache para evitar múltiplas reconexões
 */
export const getTenantDb = cache(async (databaseUrl: string) => {
  try {
    if (!dbConnections.has(databaseUrl)) {
      const client = postgres(databaseUrl, {
        max: 10, // Pool size
        idle_timeout: 30,
      })
      const db = drizzle(client)
      dbConnections.set(databaseUrl, db)
      console.log('[v0] Tenant DB connection created:', databaseUrl.split('@')[1]?.split('/')[0])
    }
    return dbConnections.get(databaseUrl)!
  } catch (error) {
    console.error('[v0] Error connecting to tenant database:', error)
    throw error
  }
})

/**
 * Fechar conexão com banco de dados específico
 */
export function closeTenantDb(databaseUrl: string) {
  const db = dbConnections.get(databaseUrl)
  if (db) {
    dbConnections.delete(databaseUrl)
    console.log('[v0] Tenant DB connection closed')
  }
}

/**
 * Fechar todas as conexões
 */
export function closeAllTenantDbs() {
  dbConnections.forEach((_, url) => {
    closeTenantDb(url)
  })
}

/**
 * Get informações do tenant do banco MASTER
 */
export async function getTenantBySlug(slug: string) {
  try {
    const masterDb = process.env.DATABASE_URL
    if (!masterDb) {
      throw new Error('DATABASE_URL environment variable not set')
    }

    const client = postgres(masterDb)
    const db = drizzle(client)

    // Import dinâmico para evitar ciclo
    const { tenants, tenantBranding, tenantSubscriptions } = await import('@/lib/db/schema')

    const result = await db
      .select({
        tenant: tenants,
        branding: tenantBranding,
        subscription: tenantSubscriptions,
      })
      .from(tenants)
      .leftJoin(tenantBranding, (table) => table.tenants.id === tenantBranding.tenantId)
      .leftJoin(tenantSubscriptions, (table) => table.tenants.id === tenantSubscriptions.tenantId)
      .where((table) => table.tenants.slug === slug)
      .limit(1)

    if (result.length === 0) {
      return null
    }

    const { tenant, branding } = result[0]

    return {
      ...tenant,
      branding: branding || {
        logoUrl: undefined,
        primaryColor: '#3B82F6',
        secondaryColor: '#06B6D4',
        accentColor: '#10B981',
        backgroundColor: '#0B0F19',
        textColor: '#F1F5F9',
        theme: 'dark' as const,
        favicon: undefined,
      },
    }
  } catch (error) {
    console.error('[v0] Error fetching tenant:', error)
    throw error
  }
}

/**
 * Get informações do tenant por ID
 */
export async function getTenantById(tenantId: string) {
  try {
    const masterDb = process.env.DATABASE_URL
    if (!masterDb) {
      throw new Error('DATABASE_URL environment variable not set')
    }

    const client = postgres(masterDb)
    const db = drizzle(client)

    const { tenants, tenantBranding } = await import('@/lib/db/schema')
    const { eq } = await import('drizzle-orm')

    const result = await db
      .select({
        tenant: tenants,
        branding: tenantBranding,
      })
      .from(tenants)
      .leftJoin(tenantBranding, eq(tenants.id, tenantBranding.tenantId))
      .where(eq(tenants.id, tenantId))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    const { tenant, branding } = result[0]

    return {
      ...tenant,
      branding: branding || {
        logoUrl: undefined,
        primaryColor: '#3B82F6',
        secondaryColor: '#06B6D4',
        accentColor: '#10B981',
        backgroundColor: '#0B0F19',
        textColor: '#F1F5F9',
        theme: 'dark' as const,
        favicon: undefined,
      },
    }
  } catch (error) {
    console.error('[v0] Error fetching tenant by ID:', error)
    throw error
  }
}

/**
 * Verificar se o usuário é Master Admin
 */
export async function isMasterAdmin(userEmail: string) {
  return userEmail === 'admin@glabcursos.com' || userEmail === 'admin@glabcursos.com.br'
}

/**
 * Get informações de branding do tenant
 */
export function getBrandingVariables(branding: any) {
  return {
    '--primary-color': branding?.primaryColor || '#3B82F6',
    '--secondary-color': branding?.secondaryColor || '#06B6D4',
    '--accent-color': branding?.accentColor || '#10B981',
    '--background-color': branding?.backgroundColor || '#0B0F19',
    '--text-color': branding?.textColor || '#F1F5F9',
  } as React.CSSProperties
}
