import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// DELETE /api/admin/cursos/[id] - Deletar curso
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    const isAdmin = request.headers.get('x-user-admin')

    if (!userId || isAdmin !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const curso = await prisma.curso.delete({
      where: { id },
    })

    return NextResponse.json(curso)
  } catch (error) {
    console.error('[v0] API erro ao deletar curso:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar curso' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/cursos/[id] - Atualizar curso
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    const isAdmin = request.headers.get('x-user-admin')

    if (!userId || isAdmin !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    const curso = await prisma.curso.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(curso)
  } catch (error) {
    console.error('[v0] API erro ao atualizar curso:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar curso' },
      { status: 500 }
    )
  }
}
