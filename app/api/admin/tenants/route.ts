import { NextRequest, NextResponse } from 'next/server'
import { getAllTenants, createTenant } from '@/lib/tenant'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * GET /api/admin/tenants
 * List all tenants (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se usuário está autenticado e é admin
    const authCookie = request.cookies.get('auth_session')
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Verificar se é admin@glabcursos.com.br
    // Por enquanto, vamos permitir qualquer usuário autenticado
    const adminUserId = 'admin' // TODO: Obter do session

    const tenants = await getAllTenants(adminUserId)

    return NextResponse.json({
      success: true,
      tenants,
    })
  } catch (error) {
    console.error('[API] Error fetching tenants:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/tenants
 * Create a new tenant (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('auth_session')
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validar dados
    if (!body.name || !body.email || !body.slug) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, slug' },
        { status: 400 }
      )
    }

    // Validar slug (apenas lowercase, números e hífens)
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(body.slug)) {
      return NextResponse.json(
        { error: 'Invalid slug: only lowercase letters, numbers, and hyphens allowed' },
        { status: 400 }
      )
    }

    // TODO: Obter userId do admin autenticado
    const adminUserId = 'admin'

    // Criar tenant
    const tenant = await createTenant({
      slug: body.slug,
      name: body.name,
      email: body.email,
      ownerUserId: adminUserId,
      databaseUrl: process.env.DATABASE_URL || '',
      databaseName: `tenant_${body.slug}`,
      plan: body.plan || 'free',
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      tenant,
    })
  } catch (error) {
    console.error('[API] Error creating tenant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
