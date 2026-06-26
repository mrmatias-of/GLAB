import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { clientes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDatabase()
    const data = await db
      .select()
      .from(clientes)
      .where(eq(clientes.userId, session.user.id))
      .orderBy(clientes.createdAt)

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] GET /api/clientes:', error)
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
    const db = await getDatabase()

    const result = await db
      .insert(clientes)
      .values({
        userId: session.user.id,
        nome: body.nome,
        email: body.email,
        telefone: body.telefone,
        cpf_cnpj: body.cpf_cnpj,
        endereco: body.endereco,
        cidade: body.cidade,
        estado: body.estado,
        cep: body.cep,
        observacoes: body.observacoes,
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/clientes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
