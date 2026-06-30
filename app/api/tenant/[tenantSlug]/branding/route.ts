import { NextRequest, NextResponse } from 'next/server'
import { getCurrentTenant, updateTenantBranding } from '@/lib/tenant'

export async function PUT(
  request: NextRequest,
  { params }: { params: { tenantSlug: string } }
) {
  try {
    const { tenantSlug } = params
    const tenant = await getCurrentTenant(tenantSlug)

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Validar cores (hex format)
    const colorRegex = /^#[0-9A-F]{6}$/i
    const colors = [
      'primaryColor',
      'secondaryColor',
      'accentColor',
      'backgroundColor',
      'textColor',
    ]

    for (const color of colors) {
      if (body[color] && !colorRegex.test(body[color])) {
        return NextResponse.json(
          { error: `Invalid ${color}: must be hex format #RRGGBB` },
          { status: 400 }
        )
      }
    }

    // Validar theme
    if (body.theme && !['dark', 'light'].includes(body.theme)) {
      return NextResponse.json(
        { error: 'Invalid theme: must be dark or light' },
        { status: 400 }
      )
    }

    // Atualizar branding
    const updated = await updateTenantBranding(tenant.id, {
      primaryColor: body.primaryColor,
      secondaryColor: body.secondaryColor,
      accentColor: body.accentColor,
      backgroundColor: body.backgroundColor,
      textColor: body.textColor,
      theme: body.theme,
      logoUrl: body.logoUrl,
    })

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update branding' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error('[API] Error updating branding:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
