import { NextRequest, NextResponse } from 'next/server'
import { getCategories } from '@/lib/support'

export async function GET(request: NextRequest) {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    )
  }
}
