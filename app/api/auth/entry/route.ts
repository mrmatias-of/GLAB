import { NextResponse } from 'next/server'
import { currentPlatformUser, isPlatformAdmin } from '@/lib/learning-platform'

export async function GET() {
  const user = await currentPlatformUser()
  if (!user) return NextResponse.json({ href: '/sign-in' }, { status: 401 })

  return NextResponse.json({
    href: isPlatformAdmin(user.email) ? '/admin' : '/aluno',
  })
}
