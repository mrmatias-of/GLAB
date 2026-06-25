import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/admin/cursos/reorder - Reordenar cursos
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const isAdmin = request.headers.get('x-user-admin')

    if (!userId || isAdmin !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Body deve ser array de { id, ordem }
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Body deve ser um array' },
        { status: 400 }
      )
    }

    // Atualizar ordem de cada curso
    for (const item of body) {
      if (!item.id || item.ordem === undefined) {
        return NextResponse.json(
          { error: 'Cada item deve ter id e ordem' },
          { status: 400 }
        )
      }

      await prisma.curso.update({
        where: { id: item.id },
        data: { ordem: item.ordem },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] API erro ao reordenar:', error)
    return NextResponse.json(
      { error: 'Erro ao reordenar cursos' },
      { status: 500 }
    )
  }
}
