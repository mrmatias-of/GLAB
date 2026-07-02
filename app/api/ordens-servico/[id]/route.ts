import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ordemService } from '@/src/modules/ordens'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { validateBody } from '@/lib/validators/schema-validator'
import { UpdateOrdemSchema } from '@/src/modules/ordens/schemas'
import { checkRateLimit } from '@/lib/security/rate-limit'

async function getRequestContext() {
  const hdrs = await headers()
  const session = await auth.api.getSession({ headers: hdrs })
  if (!session?.user) return null
  return {
    userId: session.user.id,
    tenantId: session.user.tenantId || 'default',
    session,
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rl = await checkRateLimit(req, 'user')
    if (!rl.allowed) return createApiError('Rate limit exceeded', 429)

    const ctx = await getRequestContext()
    if (!ctx) return createApiError('Unauthorized', 401)

    const { id } = await params
    const ordem = await ordemService.obter(ctx.userId, ctx.tenantId, parseInt(id))
    if (!ordem) return createApiError('Ordem not found', 404)

    return createApiSuccess(ordem, 'Ordem obtida com sucesso')
  } catch (error) {
    console.error('[API] GET /ordens-servico/[id]:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rl = await checkRateLimit(req, 'user')
    if (!rl.allowed) return createApiError('Rate limit exceeded', 429)

    const ctx = await getRequestContext()
    if (!ctx) return createApiError('Unauthorized', 401)

    const csrfToken = req.headers.get('x-csrf-token')
    if (!csrfToken) return createApiError('CSRF token required', 403)

    const { id } = await params
    const body = await req.json()
    const validated = await validateBody(body, UpdateOrdemSchema)
    if (validated.error) return createApiError(validated.message, 400)

    const ordem = await ordemService.atualizar(ctx.userId, ctx.tenantId, parseInt(id), validated.data)
    return createApiSuccess(ordem, 'Ordem atualizada com sucesso')
  } catch (error) {
    console.error('[API] PUT /ordens-servico/[id]:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rl = await checkRateLimit(req, 'user')
    if (!rl.allowed) return createApiError('Rate limit exceeded', 429)

    const ctx = await getRequestContext()
    if (!ctx) return createApiError('Unauthorized', 401)

    const csrfToken = req.headers.get('x-csrf-token')
    if (!csrfToken) return createApiError('CSRF token required', 403)

    const { id } = await params
    await ordemService.deletar(ctx.userId, ctx.tenantId, parseInt(id))
    return createApiSuccess(null, 'Ordem deletada com sucesso')
  } catch (error) {
    console.error('[API] DELETE /ordens-servico/[id]:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}
