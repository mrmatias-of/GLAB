import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tenantBranding } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/tenants/[tenantId]/branding - Obter branding
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const branding = await db
      .select()
      .from(tenantBranding)
      .where(eq(tenantBranding.tenantId, params.tenantId))
      .limit(1)

    if (branding.length === 0) {
      return NextResponse.json({ error: 'Branding not found' }, { status: 404 })
    }

    return NextResponse.json(branding[0])
  } catch (error) {
    console.error('[v0] Error fetching branding:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/tenants/[tenantId]/branding - Atualizar branding
export async function PATCH(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const authCookie = request.cookies.get('auth_session')
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      logoUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      textColor,
      theme,
      favicon,
    } = body

    // Validar cores (hex format)
    const colorRegex = /^#[0-9A-F]{6}$/i
    const colors = { primaryColor, secondaryColor, accentColor, backgroundColor, textColor }
    for (const [key, value] of Object.entries(colors)) {
      if (value && !colorRegex.test(value as string)) {
        return NextResponse.json(
          { error: `Invalid ${key}: must be hex format (#RRGGBB)` },
          { status: 400 }
        )
      }
    }

    if (theme && !['dark', 'light'].includes(theme)) {
      return NextResponse.json(
        { error: 'Invalid theme: must be "dark" or "light"' },
        { status: 400 }
      )
    }

    const result = await db
      .update(tenantBranding)
      .set({
        ...(logoUrl !== undefined && { logoUrl }),
        ...(primaryColor && { primaryColor }),
        ...(secondaryColor && { secondaryColor }),
        ...(accentColor && { accentColor }),
        ...(backgroundColor && { backgroundColor }),
        ...(textColor && { textColor }),
        ...(theme && { theme: theme as 'dark' | 'light' }),
        ...(favicon !== undefined && { favicon }),
        updatedAt: new Date(),
      })
      .where(eq(tenantBranding.tenantId, params.tenantId))
      .returning()

    if (result.length === 0) {
      return NextResponse.json({ error: 'Branding not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      branding: result[0],
    })
  } catch (error) {
    console.error('[v0] Error updating branding:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
