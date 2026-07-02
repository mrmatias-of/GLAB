import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { funcionarios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params } Promise<{ id: string }> }
) {
  try {
    const userId = request.cookies.get('auth_session')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await db
      .select()
      .from(funcionarios)
      .where(eq(funcionarios.id, parseInt(id)))

    if (!data.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error fetching funcionário:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params } Promise<{ id: string }> }
) {
  try {
    const userId = request.cookies.get('auth_session')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const result = await db
      .update(funcionarios)
      .set({
        nome: body.nome,
        email: body.email,
        cargo: body.cargo,
        salario_base: body.salario_base ? parseFloat(body.salario_base) : undefined,
        status: body.status,
        departamento: body.departamento,
        telefone: body.telefone,
        updatedAt: new Date(),
      })
      .where(eq(funcionarios.id, parseInt(id)))
      .returning()

    if (!result.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating funcionário:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params } Promise<{ id: string }> }
) {
  try {
    const userId = request.cookies.get('auth_session')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await db
      .update(funcionarios)
      .set({ status: 'inativo', updatedAt: new Date() })
      .where(eq(funcionarios.id, parseInt(id)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting funcionário:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
