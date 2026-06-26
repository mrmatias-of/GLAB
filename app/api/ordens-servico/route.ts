import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ordens_servico } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Generate unique OS number
async function generateOSNumber(userId: string) {
  const latestOS = await db
    .select()
    .from(ordens_servico)
    .where(eq(ordens_servico.userId, userId))
    .orderBy(ordens_servico.createdAt)
    .then((res) => res[res.length - 1])

  const num = (latestOS?.id || 0) + 1
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return `OS-${date}-${String(num).padStart(4, '0')}`
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await db
      .select()
      .from(ordens_servico)
      .where(eq(ordens_servico.userId, session.user.id))
      .orderBy(ordens_servico.createdAt)

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] GET /api/ordens-servico:', error)
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
    const numero = await generateOSNumber(session.user.id)

    const result = await db
      .insert(ordens_servico)
      .values({
        userId: session.user.id,
        numero,
        cliente_id: body.cliente_id,
        tecnico_id: body.tecnico_id,
        descricao: body.descricao,
        equipamento: body.equipamento,
        numero_serie: body.numero_serie,
        prioridade: body.prioridade || 'normal',
        status: 'aberto',
        data_prevista: body.data_prevista ? new Date(body.data_prevista) : undefined,
        tempo_estimado_horas: body.tempo_estimado_horas,
        valor_orcado: body.valor_orcado,
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/ordens-servico:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
