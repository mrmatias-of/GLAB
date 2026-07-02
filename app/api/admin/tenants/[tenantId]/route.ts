import { NextRequest, NextResponse } from 'next/server'
import { deleteTenant, updateTenantPlan, suspendTenant } from '@/lib/tenant'
import { db } from '@/lib/db'
import { tenants } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * GET /api/admin/tenants/[tenantId]
 * Get tenant details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const authCookie = request.cookies.get('auth_session')
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, params.tenantId))
      .limit(1)

    if (tenant.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      tenant: tenant[0],
    })
  } catch (error) {
    console.error('[API] Error fetching tenant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/tenants/[tenantId]
 * Update tenant (plan, status, etc)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const authCookie = request.cookies.get('auth_session')
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const tenantId = params.tenantId

    // Atualizar plan
    if (body.plan) {
      const validPlans = ['free', 'pro', 'enterprise']
      if (!validPlans.includes(body.plan)) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
      }
      await updateTenantPlan(tenantId, body.plan)
    }

    // Suspender tenant
    if (body.suspend === true) {
      await suspendTenant(tenantId)
    }

    const updated = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .limit(1)

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      tenant: updated[0],
    })
  } catch (error) {
    console.error('[API] Error updating tenant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/tenants/[tenantId]
 * Delete a tenant (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const authCookie = request.cookies.get('auth_session')
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const deleted = await deleteTenant(params.tenantId)

    if (!deleted) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Tenant deleted',
    })
  } catch (error) {
    console.error('[API] Error deleting tenant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
