import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL

  return NextResponse.json({
    DATABASE_URL_DEFINED: !!dbUrl,
    DATABASE_URL_VALUE: dbUrl ? dbUrl.substring(0, 80) : 'undefined',
    DATABASE_URL_FULL: dbUrl,
    NODE_ENV: process.env.NODE_ENV,
    TIMESTAMP: new Date().toISOString(),
  })
}
