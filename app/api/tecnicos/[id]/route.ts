import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tecnicos } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await db
      .select()
      .from(tecnicos)
      .where(
        and(
          eq(tecnicos.id, parseInt(params.id)),
          eq(tecnicos.userId, session.user.id)
        )
      )

    if (!data.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('[v0] GET /api/tecnicos/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
      .update(tecnicos)
      .set({
        nome: body.nome,
        email: body.email,
        telefone: body.telefone,
        especialidade: body.especialidade,
        status: body.status,
        comissao_percentual: body.comissao_percentual,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(tecnicos.id, parseInt(params.id)),
          eq(tecnicos.userId, session.user.id)
        )
      )
      .returning()

    if (!result.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('[v0] PUT /api/tecnicos/[id]:', error)
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
      .delete(tecnicos)
      .where(
        and(
          eq(tecnicos.id, parseInt(params.id)),
          eq(tecnicos.userId, session.user.id)
        )
      )
      .returning()

    if (!result.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/tecnicos/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
