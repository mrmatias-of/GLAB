import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { estoqueService } from '@/src/modules/estoque'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { validateBody } from '@/lib/validators/schema-validator'
import { UpdateEstoqueSchema } from '@/src/modules/estoque/schemas'
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
    const item = await estoqueService.obter(ctx.userId, ctx.tenantId, parseInt(id))
    if (!item) return createApiError('Item not found', 404)

    const movimentacoes = await estoqueService.obterMovimentacoes(
      ctx.userId,
      ctx.tenantId,
      parseInt(id)
    )

    return createApiSuccess({ item, movimentacoes }, 'Item obtido com sucesso')
  } catch (error) {
    console.error('[API] GET /estoque/[id]:', error)
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
    const validated = await validateBody(body, UpdateEstoqueSchema)
    if (validated.error) return createApiError(validated.message, 400)

    const item = await estoqueService.atualizar(ctx.userId, ctx.tenantId, parseInt(id), validated.data)
    return createApiSuccess(item, 'Item atualizado com sucesso')
  } catch (error) {
    console.error('[API] PUT /estoque/[id]:', error)
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
    await estoqueService.deletar(ctx.userId, ctx.tenantId, parseInt(id))
    return createApiSuccess(null, 'Item deletado com sucesso')
  } catch (error) {
    console.error('[API] DELETE /estoque/[id]:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}
