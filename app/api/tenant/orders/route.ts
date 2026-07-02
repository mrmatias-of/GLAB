import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ordens_servico } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const pageStr = request.nextUrl.searchParams.get('page') || '1'
    const statusFilter = request.nextUrl.searchParams.get('status')
    const page = Math.max(1, parseInt(pageStr))
    const limit = 10

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = db
      .select()
      .from(ordens_servico)
      .where(eq(ordens_servico.userId, userId))

    if (statusFilter) {
      query = db
        .select()
        .from(ordens_servico)
        .where(eq(ordens_servico.userId, userId))
    }

    const orders = await query
      .orderBy(desc(ordens_servico.data_abertura))
      .limit(limit)
      .offset((page - 1) * limit)

    const totalResult = await db
      .select()
      .from(ordens_servico)
      .where(eq(ordens_servico.userId, userId))

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total: totalResult.length,
        pages: Math.ceil(totalResult.length / limit),
      },
    })
  } catch (error) {
    console.error('[Orders API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const body = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      numero,
      cliente_id,
      descricao,
      equipamento,
      prioridade = 'normal',
    } = body

    if (!numero || !descricao) {
      return NextResponse.json(
        { error: 'Missing required fields: numero, descricao' },
        { status: 400 }
      )
    }

    await db.insert(ordens_servico).values({
      numero,
      cliente_id,
      descricao,
      equipamento,
      prioridade,
      userId,
      status: 'aberto',
    })

    return NextResponse.json(
      { success: true, message: 'Order created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Orders API] Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
