import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tecnicos } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await db
      .select()
      .from(tecnicos)
      .where(eq(tecnicos.userId, session.user.id))
      .orderBy(tecnicos.createdAt)

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] GET /api/tecnicos:', error)
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
      .insert(tecnicos)
      .values({
        userId: session.user.id,
        nome: body.nome,
        email: body.email,
        telefone: body.telefone,
        cpf: body.cpf,
        especialidade: body.especialidade,
        status: body.status || 'ativo',
        comissao_percentual: body.comissao_percentual || '10',
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/tecnicos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
