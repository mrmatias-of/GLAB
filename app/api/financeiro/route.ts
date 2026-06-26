import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { financeiro } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const tipo = searchParams.get('tipo')
    const status = searchParams.get('status')

    let query = db
      .select()
      .from(financeiro)
      .where(eq(financeiro.userId, session.user.id))

    if (tipo) {
      query = db
        .select()
        .from(financeiro)
        .where(eq(financeiro.tipo, tipo))
    }

    const data = await query.orderBy(financeiro.createdAt)

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] GET /api/financeiro:', error)
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
      .insert(financeiro)
      .values({
        userId: session.user.id,
        os_id: body.os_id,
        tecnico_id: body.tecnico_id,
        tipo: body.tipo, // receita, despesa, comissao
        descricao: body.descricao,
        valor: body.valor,
        categoria: body.categoria,
        status: body.status || 'pendente',
        data_vencimento: body.data_vencimento ? new Date(body.data_vencimento) : undefined,
        forma_pagamento: body.forma_pagamento,
        observacoes: body.observacoes,
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/financeiro:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
