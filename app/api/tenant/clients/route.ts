import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { clientes } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const pageStr = request.nextUrl.searchParams.get('page') || '1'
    const page = Math.max(1, parseInt(pageStr))
    const limit = 20

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clients = await db
      .select()
      .from(clientes)
      .where(eq(clientes.userId, userId))
      .orderBy(desc(clientes.createdAt))
      .limit(limit)
      .offset((page - 1) * limit)

    const totalResult = await db
      .select()
      .from(clientes)
      .where(eq(clientes.userId, userId))

    return NextResponse.json({
      success: true,
      data: clients,
      pagination: {
        page,
        limit,
        total: totalResult.length,
        pages: Math.ceil(totalResult.length / limit),
      },
    })
  } catch (error) {
    console.error('[Clients API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
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

    const { nome, email, telefone, cpf_cnpj, endereco, cidade, estado, cep } =
      body

    if (!nome) {
      return NextResponse.json(
        { error: 'Nome is required' },
        { status: 400 }
      )
    }

    await db.insert(clientes).values({
      nome,
      email,
      telefone,
      cpf_cnpj,
      endereco,
      cidade,
      estado,
      cep,
      userId,
    })

    return NextResponse.json(
      { success: true, message: 'Client created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Clients API] Error creating client:', error)
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
}
