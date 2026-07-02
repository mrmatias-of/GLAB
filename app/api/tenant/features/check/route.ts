import { NextRequest, NextResponse } from 'next/server'
import { db as masterDb } from '@/lib/db'
import { getCurrentTenantId } from '@/lib/db/tenant-queries'
import { feature_flags, tenant_features, plan_features, subscriptions, plans } from '@/lib/db/master-schema'
import { tenants } from '@/lib/db/master-schema'
import { eq, and } from 'drizzle-orm'

/**
 * POST /api/tenant/features/check
 * Check if a feature is enabled for current tenant
 * 
 * Body: { feature_key: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { feature_key } = body

    if (!feature_key) {
      return NextResponse.json(
        { error: 'feature_key é obrigatório' },
        { status: 400 }
      )
    }

    const tenantId = await getCurrentTenantId()

    // Check if tenant explicitly enabled/disabled this feature
    const tenantFeature = await masterDb.query.tenant_features.findFirst({
      where: and(
        eq(tenant_features.tenant_id, tenantId),
        eq((await masterDb.query.feature_flags.findFirst({ 
          where: eq(feature_flags.key, feature_key) 
        }) as any)?.id || 0, (await masterDb.query.feature_flags.findFirst({ 
          where: eq(feature_flags.key, feature_key) 
        }) as any)?.id || 0)
      ),
    })

    if (tenantFeature) {
      return NextResponse.json({
        enabled: tenantFeature.is_enabled,
        reason: 'tenant_override',
      })
    }

    // Get tenant's subscription plan
    const subscription = await masterDb.query.subscriptions.findFirst({
      where: eq(subscriptions.tenant_id, tenantId),
    })

    if (!subscription) {
      return NextResponse.json({
        enabled: false,
        reason: 'no_subscription',
      })
    }

    // Get feature from plan
    const flag = await masterDb.query.feature_flags.findFirst({
      where: eq(feature_flags.key, feature_key),
    })

    if (!flag) {
      return NextResponse.json({
        enabled: false,
        reason: 'feature_not_found',
      })
    }

    // Check if feature is in plan
    const planFeature = await masterDb.query.plan_features.findFirst({
      where: and(
        eq(plan_features.plan_id, subscription.plan_id),
        eq(plan_features.feature_id, flag.id)
      ),
    })

    const enabled = !!planFeature && flag.is_active
    
    return NextResponse.json({
      enabled,
      reason: planFeature ? 'included_in_plan' : 'not_in_plan',
      featureId: flag.id,
      planId: subscription.plan_id,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
