import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const userId = await verifySession(token)

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        is_admin: true,
        is_vendedor: true,
      },
    })

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('[v0] Get user error:', error)
    return NextResponse.json(
      { user: null },
      { status: 200 }
    )
  }
}
