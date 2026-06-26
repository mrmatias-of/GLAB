import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { financeiro } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const result = await db
      .update(financeiro)
      .set({
        status: body.status,
        data_pagamento: body.status === 'pago' ? new Date() : body.data_pagamento,
        observacoes: body.observacoes,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(financeiro.id, parseInt(params.id)),
          eq(financeiro.userId, session.user.id)
        )
      )
      .returning()

    if (!result.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('[v0] PUT /api/financeiro/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await db
      .delete(financeiro)
      .where(
        and(
          eq(financeiro.id, parseInt(params.id)),
          eq(financeiro.userId, session.user.id)
        )
      )
      .returning()

    if (!result.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/financeiro/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
