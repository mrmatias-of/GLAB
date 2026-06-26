import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { estoque } from '@/lib/db/schema'
import { eq, lt } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const showAlertas = searchParams.get('alertas') === 'true'

    let query = db
      .select()
      .from(estoque)
      .where(eq(estoque.userId, session.user.id))

    if (showAlertas) {
      query = db
        .select()
        .from(estoque)
        .where(
          lt(estoque.quantidade_atual, estoque.quantidade_minima)
        )
    }

    const data = await query.orderBy(estoque.createdAt)

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] GET /api/estoque:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const result = await db
      .insert(estoque)
      .values({
        userId: session.user.id,
        nome: body.nome,
        descricao: body.descricao,
        categoria: body.categoria,
        quantidade_atual: body.quantidade_atual || '0',
        quantidade_minima: body.quantidade_minima || '5',
        valor_unitario: body.valor_unitario,
        localizacao: body.localizacao,
        garantia_meses: body.garantia_meses,
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/estoque:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
