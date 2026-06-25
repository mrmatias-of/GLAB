import { NextRequest, NextResponse } from 'next/server'
import { logout } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (token) {
      await logout(token)
    }

    const response = NextResponse.json({ message: 'Deslogado com sucesso' }, { status: 200 })
    response.cookies.delete('auth_token')

    return response
  } catch (error) {
    console.error('[v0] Logout error:', error)
    return NextResponse.json(
      { error: 'Erro ao deslogar' },
      { status: 500 }
    )
  }
}
