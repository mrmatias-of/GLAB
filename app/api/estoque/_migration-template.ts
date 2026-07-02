// Template for Estoque routes - replace placeholders with actual service calls

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { estoqueService } from '@/src/modules/estoque'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { validateBody } from '@/lib/validators/schema-validator'
import { CreateEstoqueSchema, UpdateEstoqueSchema } from '@/src/modules/estoque/schemas'
import { checkRateLimit } from '@/lib/security/rate-limit'

async function getRequestContext() {
  const hdrs = await headers()
  const session = await auth.api.getSession({ headers: hdrs })
  if (!session?.user) return null
  return {
    userId: session.user.id,
    tenantId: session.user.tenantId || 'default',
    session,
    headers: hdrs,
  }
}

export async function GET(req: NextRequest) {
  try {
    const rl = await checkRateLimit(req, 'user')
    if (!rl.allowed) return createApiError('Rate limit exceeded', 429)

    const ctx = await getRequestContext()
    if (!ctx) return createApiError('Unauthorized', 401)

    // TODO: Add actual service call
    // const items = await estoqueService.listar(ctx.userId, ctx.tenantId)
    
    return createApiSuccess([], 'Items listados com sucesso')
  } catch (error) {
    console.error('[API] GET /estoque:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const rl = await checkRateLimit(req, 'create')
    if (!rl.allowed) return createApiError('Rate limit exceeded', 429)

    const ctx = await getRequestContext()
    if (!ctx) return createApiError('Unauthorized', 401)

    const csrfToken = req.headers.get('x-csrf-token')
    if (!csrfToken) return createApiError('CSRF token required', 403)

    const body = await req.json()
    const validated = await validateBody(body, CreateEstoqueSchema)
    if (validated.error) return createApiError(validated.message, 400)

    // TODO: Add actual service call
    // const item = await estoqueService.criar(ctx.userId, ctx.tenantId, validated.data)
    
    return createApiSuccess(null, 'Item criado com sucesso', 201)
  } catch (error) {
    console.error('[API] POST /estoque:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}
