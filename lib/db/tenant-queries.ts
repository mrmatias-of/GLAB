import { db } from '@/lib/db'
import { headers, cookies } from 'next/headers'
import { eq, and, SQL } from 'drizzle-orm'

/**
 * Get current tenant ID from request context
 */
export async function getCurrentTenantId(): Promise<string> {
  // Try to get from headers (set by middleware)
  const headersList = await headers()
  const tenantId = headersList.get('X-Tenant-ID')

  if (tenantId) {
    return tenantId
  }

  // Fallback to cookie
  const cookieStore = await cookies()
  const cookieTenantId = cookieStore.get('tenantId')?.value

  if (cookieTenantId) {
    return cookieTenantId
  }

  throw new Error('Tenant context not found. Make sure tenant middleware is configured.')
}

/**
 * Get current tenant slug from request context
 */
export async function getCurrentTenantSlug(): Promise<string> {
  const headersList = await headers()
  const tenantSlug = headersList.get('X-Tenant-Slug')

  if (tenantSlug) {
    return tenantSlug
  }

  const cookieStore = await cookies()
  const cookieTenantSlug = cookieStore.get('tenantSlug')?.value

  if (cookieTenantSlug) {
    return cookieTenantSlug
  }

  throw new Error('Tenant slug not found in context.')
}

/**
 * Build a WHERE clause that includes tenantId filtering
 * 
 * Usage:
 *   const tenantFilter = await buildTenantFilter(clientes.tenantId)
 *   const results = await db.select().from(clientes).where(tenantFilter)
 */
export async function buildTenantFilter(
  tenantIdColumn: SQL
): Promise<SQL> {
  const tenantId = await getCurrentTenantId()
  return eq(tenantIdColumn, tenantId)
}

/**
 * Wrap a WHERE condition with tenant filtering
 * 
 * Usage:
 *   const condition = withTenantFilter(eq(clientes.id, clienteId), clientes.tenantId)
 *   const result = await db.select().from(clientes).where(condition)
 */
export async function withTenantFilter(
  condition: SQL,
  tenantIdColumn: SQL
): Promise<SQL> {
  const tenantFilter = await buildTenantFilter(tenantIdColumn)
  return and(condition, tenantFilter)
}

/**
 * Add tenantId to insert/update data
 * 
 * Usage:
 *   const data = { name: 'John', email: 'john@example.com' }
 *   const withTenant = await withTenantData(data)
 *   // Returns: { name: 'John', email: 'john@example.com', tenantId: '...' }
 */
export async function withTenantData<T extends Record<string, any>>(
  data: T
): Promise<T & { tenantId: string }> {
  const tenantId = await getCurrentTenantId()
  return {
    ...data,
    tenantId,
  }
}

/**
 * Assert that data belongs to current tenant
 * Useful for delete/update operations to prevent cross-tenant data access
 */
export async function assertTenantOwnership(
  dataItem: { tenantId: string }
): Promise<void> {
  const currentTenantId = await getCurrentTenantId()

  if (dataItem.tenantId !== currentTenantId) {
    throw new Error('Access denied: Data does not belong to your tenant')
  }
}

/**
 * Example usage in API route:
 * 
 * export async function GET(request: Request, { params }: { params: { id: string } }) {
 *   try {
 *     const cliente = await db.query.clientes.findFirst({
 *       where: await withTenantFilter(
 *         eq(clientes.id, parseInt(params.id)),
 *         clientes.tenantId
 *       )
 *     })
 *
 *     if (!cliente) {
 *       return NextResponse.json({ error: 'Not found' }, { status: 404 })
 *     }
 *
 *     return NextResponse.json(cliente)
 *   } catch (error) {
 *     return NextResponse.json({ error: error.message }, { status: 500 })
 *   }
 * }
 */
