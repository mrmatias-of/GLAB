import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Use /api/auth/sign-in/email para autenticar.' },
    { status: 410 },
  )
}
