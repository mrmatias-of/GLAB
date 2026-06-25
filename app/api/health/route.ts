import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    databaseUrlDefined: !!process.env.DATABASE_URL,
  }

  try {
    console.log('[v0] Health check - Testing Prisma connection')
    
    // Test 1: Prisma connection
    const startTime = Date.now()
    const result = await prisma.$queryRaw`SELECT 1 as health`
    const connectionTime = Date.now() - startTime
    
    diagnostics.prismaConnection = {
      status: 'OK',
      connectionTimeMs: connectionTime,
    }
    console.log('[v0] Health check - Prisma OK (', connectionTime, 'ms)')

    // Test 2: User table exists and accessible
    const userCount = await prisma.user.count()
    diagnostics.userTable = {
      status: 'OK',
      totalUsers: userCount,
    }
    console.log('[v0] Health check - User table OK, total users:', userCount)

    // Test 3: Admin user exists
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@glabcursos.com' },
      select: { id: true, email: true },
    })
    diagnostics.adminUser = {
      status: adminExists ? 'EXISTS' : 'NOT_FOUND',
      found: !!adminExists,
    }
    console.log('[v0] Health check - Admin user:', adminExists ? 'EXISTS' : 'NOT_FOUND')

    return NextResponse.json(
      {
        status: 'healthy',
        diagnostics,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Health check - FAILED:', error)
    
    diagnostics.error = {
      message: error instanceof Error ? error.message : String(error),
      type: error instanceof Error ? error.constructor.name : typeof error,
    }

    // Detailed error analysis
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        diagnostics.errorAnalysis = 'Connection failed - check firewall/IP whitelist'
      } else if (error.message.includes('PROTOCOL')) {
        diagnostics.errorAnalysis = 'Protocol error - check DATABASE_URL format'
      } else if (error.message.includes('timeout')) {
        diagnostics.errorAnalysis = 'Timeout - check network connectivity'
      } else if (error.message.includes('authentication')) {
        diagnostics.errorAnalysis = 'Auth failed - check credentials in DATABASE_URL'
      }
    }

    return NextResponse.json(
      {
        status: 'unhealthy',
        diagnostics,
      },
      { status: 503 }
    )
  }
}
