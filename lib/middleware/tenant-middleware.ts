import { NextRequest, NextResponse } from 'next/server'
import { db as masterDb } from '@/lib/db'
import { tenants } from '@/lib/db/master-schema'
import { eq } from 'drizzle-orm'

/**
 * Tenant Detection Middleware
 * 
 * Suporta 3 formas de identificar o tenant:
 * 1. Subdomain: tenant-slug.localhost:3000 or tenant-slug.app.com
 * 2. Path: /tenant/tenant-slug/* or /t/tenant-slug/*
 * 3. Header: X-Tenant-ID or X-Tenant-Slug
 */

export interface TenantInfo {
  tenantId: string
  tenantSlug: string
  tenantName: string
  databaseUrl: string
}

export async function detectTenant(
  request: NextRequest,
  overrideTenantSlug?: string
): Promise<TenantInfo | null> {
  try {
    let tenantSlug = overrideTenantSlug

    if (!tenantSlug) {
      // 1. Check subdomain
      const host = request.headers.get('host') || ''
      const subdomain = extractSubdomain(host)

      if (subdomain && !['www', 'app', 'admin', 'api', 'mail'].includes(subdomain)) {
        tenantSlug = subdomain
      }

      // 2. Check path
      if (!tenantSlug) {
        const pathname = request.nextUrl.pathname
        if (pathname.startsWith('/tenant/')) {
          tenantSlug = pathname.split('/')[2]
        } else if (pathname.startsWith('/t/')) {
          tenantSlug = pathname.split('/')[2]
        }
      }

      // 3. Check headers
      if (!tenantSlug) {
        tenantSlug =
          request.headers.get('X-Tenant-Slug') ||
          request.headers.get('x-tenant-slug') ||
          undefined
      }
    }

    if (!tenantSlug) {
      return null
    }

    // Fetch tenant from master DB
    const tenant = await masterDb.query.tenants.findFirst({
      where: eq(tenants.slug, tenantSlug),
    })

    if (!tenant || tenant.status !== 'active') {
      return null
    }

    return {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      tenantName: tenant.name,
      databaseUrl: tenant.database_url,
    }
  } catch (error) {
    console.error('[Middleware] Error detecting tenant:', error)
    return null
  }
}

/**
 * Extract subdomain from host header
 * Examples:
 *   company.localhost:3000 -> 'company'
 *   company.app.com -> 'company'
 *   localhost:3000 -> null
 *   app.com -> null
 */
function extractSubdomain(host: string): string | null {
  const parts = host.split(':')[0].split('.')

  if (parts.length <= 2) {
    return null // No subdomain
  }

  return parts[0]
}

/**
 * Validate tenant access for a user
 */
export async function validateTenantAccess(
  userId: string,
  tenantId: string
): Promise<boolean> {
  try {
    // Check if user is member of tenant
    const membership = await masterDb.query.tenant_members.findFirst({
      where: (tm, { and, eq }) =>
        and(eq(tm.user_id, userId), eq(tm.tenant_id, tenantId)),
    })

    return !!membership
  } catch (error) {
    console.error('[Middleware] Error validating tenant access:', error)
    return false
  }
}

/**
 * Set tenant context in response headers and cookies
 */
export function setTenantContext(
  response: NextResponse,
  tenantInfo: TenantInfo
): NextResponse {
  response.headers.set('X-Tenant-ID', tenantInfo.tenantId)
  response.headers.set('X-Tenant-Slug', tenantInfo.tenantSlug)

  // Set cookie for client-side access
  response.cookies.set('tenantId', tenantInfo.tenantId, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  response.cookies.set('tenantSlug', tenantInfo.tenantSlug, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return response
}

/**
 * Get tenant from request context (headers or cookies)
 */
export function getTenantFromRequest(request: NextRequest): {
  tenantId: string
  tenantSlug: string
} | null {
  const tenantId = request.headers.get('X-Tenant-ID') || request.cookies.get('tenantId')?.value
  const tenantSlug = request.headers.get('X-Tenant-Slug') || request.cookies.get('tenantSlug')?.value

  if (tenantId && tenantSlug) {
    return { tenantId, tenantSlug }
  }

  return null
}
