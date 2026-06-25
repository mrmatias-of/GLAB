import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// PATCH /api/admin/cursos/[id]/toggle - Toggle ativo/inativo
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
    const { ativo } = body

    if (typeof ativo !== 'boolean') {
      return NextResponse.json(
        { error: 'ativo deve ser um booleano' },
        { status: 400 }
      )
    }

    const curso = await prisma.curso.update({
      where: { id },
      data: { ativo },
    })

    return NextResponse.json(curso)
  } catch (error) {
    console.error('[v0] API erro ao atualizar status:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar status' },
      { status: 500 }
    )
  }
}
