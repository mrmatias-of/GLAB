import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tecnicos } from '@/lib/db/schema'
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

    const technicians = await db
      .select()
      .from(tecnicos)
      .where(eq(tecnicos.userId, userId))
      .orderBy(desc(tecnicos.createdAt))
      .limit(limit)
      .offset((page - 1) * limit)

    const totalResult = await db
      .select()
      .from(tecnicos)
      .where(eq(tecnicos.userId, userId))

    return NextResponse.json({
      success: true,
      data: technicians,
      pagination: {
        page,
        limit,
        total: totalResult.length,
        pages: Math.ceil(totalResult.length / limit),
      },
    })
  } catch (error) {
    console.error('[Technicians API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch technicians' },
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

    const { nome, email, telefone, cpf, especialidade } = body

    if (!nome) {
      return NextResponse.json(
        { error: 'Nome is required' },
        { status: 400 }
      )
    }

    await db.insert(tecnicos).values({
      nome,
      email,
      telefone,
      cpf,
      especialidade,
      userId,
    })

    return NextResponse.json(
      { success: true, message: 'Technician created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Technicians API] Error creating technician:', error)
    return NextResponse.json(
      { error: 'Failed to create technician' },
      { status: 500 }
    )
  }
}
