import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ordemService } from '@/src/modules/ordens'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { validateBody } from '@/lib/validators/schema-validator'
import { CreateOrdemSchema } from '@/src/modules/ordens/schemas'
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

export async function GET(req: NextRequest) {
  try {
    const rl = await checkRateLimit(req, 'user')
    if (!rl.allowed) return createApiError('Rate limit exceeded', 429)

    const ctx = await getRequestContext()
    if (!ctx) return createApiError('Unauthorized', 401)

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const clienteId = searchParams.get('clienteId')
    const tecnicoId = searchParams.get('tecnicoId')

    const filtros: any = {}
    if (status) filtros.status = status
    if (clienteId) filtros.clienteId = parseInt(clienteId)
    if (tecnicoId) filtros.tecnicoId = parseInt(tecnicoId)

    const ordens = await ordemService.listar(ctx.userId, ctx.tenantId, filtros)
    return createApiSuccess(ordens, 'Ordens listadas com sucesso')
  } catch (error) {
    console.error('[API] GET /ordens-servico:', error)
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
    const validated = await validateBody(body, CreateOrdemSchema)
    if (validated.error) return createApiError(validated.message, 400)

    const ordem = await ordemService.criar(ctx.userId, ctx.tenantId, validated.data)
    return createApiSuccess(ordem, 'Ordem criada com sucesso', 201)
  } catch (error) {
    console.error('[API] POST /ordens-servico:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}
