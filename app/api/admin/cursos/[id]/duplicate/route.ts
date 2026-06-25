import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/admin/cursos/[id]/duplicate - Duplicar curso
export async function POST(
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

    // Buscar curso original
    const cursoOriginal = await prisma.curso.findUnique({
      where: { id },
    })

    if (!cursoOriginal) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      )
    }

    // Contar cursos para definir ordem
    const count = await prisma.curso.count()

    // Criar cópia
    const cursoCopia = await prisma.curso.create({
      data: {
        ...cursoOriginal,
        id: undefined, // Deixar banco gerar novo ID
        titulo: `${cursoOriginal.titulo} (Cópia)`,
        slug: `${cursoOriginal.slug}-copia-${Date.now()}`,
        ativo: false,
        ordem: (count + 1) * 10,
      },
    })

    return NextResponse.json(cursoCopia, { status: 201 })
  } catch (error) {
    console.error('[v0] API erro ao duplicar curso:', error)
    return NextResponse.json(
      { error: 'Erro ao duplicar curso' },
      { status: 500 }
    )
  }
}
