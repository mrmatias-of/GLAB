import { NextRequest, NextResponse } from 'next/server'
import { db as masterDb } from '@/lib/db'
import { feature_flags, plan_features, tenant_features } from '@/lib/db/master-schema'
import { eq, and } from 'drizzle-orm'

/**
 * GET /api/master/feature-flags
 * List all feature flags
 */
export async function GET(request: NextRequest) {
  try {
    const flags = await masterDb.query.feature_flags.findMany()

    return NextResponse.json(flags)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/master/feature-flags
 * Create new feature flag
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, name, description, is_global } = body

    if (!key || !name) {
      return NextResponse.json(
        { error: 'Key e name são obrigatórios' },
        { status: 400 }
      )
    }

    const flag = await masterDb.insert(feature_flags).values({
      key,
      name,
      description,
      is_global: is_global || false,
    }).returning()

    return NextResponse.json(flag[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
