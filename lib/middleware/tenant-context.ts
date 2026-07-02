import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

/**
 * Tenant Context - extracted from middleware headers
 */
export interface TenantContext {
  id: string
  userId: string
  isAuthenticated: boolean
}

/**
 * Get tenant context from request headers (set by middleware)
 */
export function getTenantContext(request: NextRequest): TenantContext | null {
  const tenantId = request.headers.get('x-tenant-id')
  const authenticated = request.headers.get('x-authenticated') === 'true'

  if (!tenantId || !authenticated) {
    return null
  }

  // In production, userId would come from session
  // For now, we'll get it from auth session
  const userId = '' // Will be set by auth
  
  return {
    id: tenantId,
    userId,
    isAuthenticated: authenticated,
  }
}

/**
 * Verify tenant access - ensure user belongs to tenant
 */
export async function verifyTenantAccess(
  request: NextRequest,
  requiredTenantId?: string
): Promise<{ valid: boolean; tenantId?: string; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    const tenantIdHeader = request.headers.get('x-tenant-id')

    if (!session) {
      return { valid: false, error: 'Not authenticated' }
    }

    if (!tenantIdHeader) {
      return { valid: false, error: 'No tenant specified' }
    }

    if (requiredTenantId && tenantIdHeader !== requiredTenantId) {
      return { valid: false, error: 'Tenant mismatch' }
    }

    // Verify user belongs to tenant
    if (session.user.tenantId !== tenantIdHeader) {
      return { valid: false, error: 'User does not belong to tenant' }
    }

    return { valid: true, tenantId: tenantIdHeader }
  } catch (error) {
    return { valid: false, error: 'Auth verification failed' }
  }
}

/**
 * Get session with tenant context
 */
export async function getSessionWithTenant(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    const tenantId = request.headers.get('x-tenant-id')

    if (!session || !tenantId) {
      return null
    }

    return {
      ...session,
      tenantId,
    }
  } catch (error) {
    return null
  }
}
