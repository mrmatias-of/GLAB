import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contracheques, funcionarios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { calcularFolhaPagamento } from '@/lib/rh/salary-calculator'

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('auth_session')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await db
      .select()
      .from(contracheques)
      .where(eq(contracheques.userId, userId))

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching contracheques:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// TODO: Implement POST - needs proper type handling for decimal/string conversions
export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Contracheque creation - TODO: implement with proper types',
    status: 'not-implemented'
  }, { status: 501 })
}
