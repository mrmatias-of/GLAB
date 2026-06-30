import { NextRequest, NextResponse } from 'next/server'
import { getCurrentTenant } from '../tenant'

/**
 * Middleware para validar tenant e proteger rotas
 * Extrai o slug do tenant da URL e valida se existe
 */
export async function validateTenantMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware para rotas públicas
  if (
    pathname.startsWith('/api/public/') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/api/auth/')
  ) {
    return NextResponse.next()
  }

  // Skip para rotas admin (master)
  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Extrair tenant slug da URL: /{tenantSlug}/...
  const pathParts = pathname.split('/').filter(Boolean)
  const tenantSlug = pathParts[0]

  if (!tenantSlug) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Validar tenant
  const tenant = await getCurrentTenant(tenantSlug)

  if (!tenant) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (tenant.status === 'suspended') {
    return NextResponse.json(
      { error: 'Tenant account is suspended' },
      { status: 403 }
    )
  }

  if (tenant.status === 'deleted') {
    return NextResponse.json(
      { error: 'Tenant account has been deleted' },
      { status: 404 }
    )
  }

  // Store tenant info in request headers for use in route handlers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-id', tenant.id)
  requestHeaders.set('x-tenant-slug', tenant.slug)
  requestHeaders.set('x-tenant-plan', tenant.plan)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

/**
 * Get tenant from request headers
 */
export function getTenantFromRequest(request: NextRequest) {
  return {
    id: request.headers.get('x-tenant-id'),
    slug: request.headers.get('x-tenant-slug'),
    plan: request.headers.get('x-tenant-plan'),
  }
}
