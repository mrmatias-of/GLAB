import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { checkRateLimit } from '@/lib/security/rate-limit'

async function getRequestContext() {
  const hdrs = await headers()
  const session = await auth.api.getSession({ headers: hdrs })
  if (!session?.user) return null
  return { userId: session.user.id, tenantId: session.user.tenantId || 'default' }
}

export async function GET(req: NextRequest) {
  try {
    const rl = await checkRateLimit(req, 'user')
    if (!rl.allowed) return createApiError('Rate limit exceeded', 429)

    const ctx = await getRequestContext()
    if (!ctx) return createApiError('Unauthorized', 401)

    // TODO: Get orders-status data from service
    return createApiSuccess({}, 'Dados obtidos com sucesso')
  } catch (error) {
    console.error('[API] GET /dashboard/orders-status:', error)
    return createApiError('Internal server error', 500)
  }
}
