import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { clientes } from '@/lib/db/schema'
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

    const db = await getDatabase()
    const data = await db
      .select()
      .from(clientes)
      .where(
        and(
          eq(clientes.id, parseInt(params.id)),
          eq(clientes.userId, session.user.id)
        )
      )

    if (!data.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('[v0] GET /api/clientes/[id]:', error)
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
    const db = await getDatabase()

    const result = await db
      .update(clientes)
      .set({
        nome: body.nome,
        email: body.email,
        telefone: body.telefone,
        cpf_cnpj: body.cpf_cnpj,
        endereco: body.endereco,
        cidade: body.cidade,
        estado: body.estado,
        cep: body.cep,
        observacoes: body.observacoes,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(clientes.id, parseInt(params.id)),
          eq(clientes.userId, session.user.id)
        )
      )
      .returning()

    if (!result.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('[v0] PUT /api/clientes/[id]:', error)
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

    const db = await getDatabase()

    const result = await db
      .delete(clientes)
      .where(
        and(
          eq(clientes.id, parseInt(params.id)),
          eq(clientes.userId, session.user.id)
        )
      )
      .returning()

    if (!result.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/clientes/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
