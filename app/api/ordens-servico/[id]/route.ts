import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ordens_servico } from '@/lib/db/schema'
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
      .from(ordens_servico)
      .where(
        and(
          eq(ordens_servico.id, parseInt(params.id)),
          eq(ordens_servico.userId, session.user.id)
        )
      )

    if (!data.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('[v0] GET /api/ordens-servico/[id]:', error)
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
      .update(ordens_servico)
      .set({
        tecnico_id: body.tecnico_id,
        status: body.status,
        prioridade: body.prioridade,
        descricao: body.descricao,
        equipamento: body.equipamento,
        data_prevista: body.data_prevista ? new Date(body.data_prevista) : undefined,
        tempo_estimado_horas: body.tempo_estimado_horas,
        valor_orcado: body.valor_orcado,
        valor_final: body.valor_final,
        status_orcamento: body.status_orcamento,
        observacoes: body.observacoes,
        data_conclusao: body.status === 'finalizado' && !body.data_conclusao ? new Date() : body.data_conclusao,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(ordens_servico.id, parseInt(params.id)),
          eq(ordens_servico.userId, session.user.id)
        )
      )
      .returning()

    if (!result.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('[v0] PUT /api/ordens-servico/[id]:', error)
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
      .delete(ordens_servico)
      .where(
        and(
          eq(ordens_servico.id, parseInt(params.id)),
          eq(ordens_servico.userId, session.user.id)
        )
      )
      .returning()

    if (!result.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/ordens-servico/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
