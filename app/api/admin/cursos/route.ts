import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/admin/cursos - Lista todos os cursos
export async function GET(request: NextRequest) {
  try {
    // Middleware valida JWT e autorização
    const userId = request.headers.get('x-user-id')
    const isAdmin = request.headers.get('x-user-admin')

    if (!userId || isAdmin !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cursos = await prisma.curso.findMany({
      orderBy: { ordem: 'asc' },
    })

    return NextResponse.json(cursos)
  } catch (error) {
    console.error('[v0] API erro ao buscar cursos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar cursos' },
      { status: 500 }
    )
  }
}

// POST /api/admin/cursos - Criar novo curso
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const isAdmin = request.headers.get('x-user-admin')

    if (!userId || isAdmin !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { titulo, slug, preco, tag, cta_href, destaque, ativo } = body

    // Validação básica
    if (!titulo || !slug) {
      return NextResponse.json(
        { error: 'Título e slug são obrigatórios' },
        { status: 400 }
      )
    }

    // Contar cursos para definir ordem
    const count = await prisma.curso.count()

    const curso = await prisma.curso.create({
      data: {
        titulo,
        slug,
        preco: preco || 'R$ 0,00',
        tag: tag || '',
        cta_href: cta_href || '#',
        destaque: destaque || false,
        ativo: ativo !== false,
        ordem: (count + 1) * 10,
      },
    })

    return NextResponse.json(curso, { status: 201 })
  } catch (error) {
    console.error('[v0] API erro ao criar curso:', error)
    return NextResponse.json(
      { error: 'Erro ao criar curso' },
      { status: 500 }
    )
  }
}
