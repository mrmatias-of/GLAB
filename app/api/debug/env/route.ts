import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL

  return NextResponse.json({
    status: 'debug-info',
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL_DEFINED: !!dbUrl,
      DATABASE_URL_FIRST_50_CHARS: dbUrl ? dbUrl.substring(0, 50) : 'NOT_DEFINED',
      DATABASE_URL_PROTOCOL: dbUrl ? dbUrl.split('://')[0] : 'N/A',
      DATABASE_URL_VALID: dbUrl?.startsWith('mysql://') ? 'YES' : 'NO',
    },
    message: dbUrl?.startsWith('mysql://')
      ? 'DATABASE_URL is correct'
      : 'DATABASE_URL is missing or invalid',
  })
}
