import { NextRequest, NextResponse } from 'next/server'

// Authentication is verified against MySQL in server-side layouts. This Edge
// function deliberately performs no cookie-based authorization.
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*', '/aluno/:path*'] }
