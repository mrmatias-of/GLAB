import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { estoqueService } from '@/src/modules/estoque'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { validateBody } from '@/lib/validators/schema-validator'
import { CreateEstoqueSchema } from '@/src/modules/estoque/schemas'
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
    const categoria = searchParams.get('categoria')
    const ativo = searchParams.get('ativo')
    const estoqueBaixo = searchParams.get('estoqueBaixo')
    const resumo = searchParams.get('resumo')

    if (resumo === 'true') {
      const result = await estoqueService.obterResumo(ctx.userId, ctx.tenantId)
      return createApiSuccess(result, 'Resumo obtido com sucesso')
    }

    let result
    if (estoqueBaixo === 'true') {
      result = await estoqueService.obterEstoqueBaixo(ctx.userId, ctx.tenantId)
    } else {
      const filtros: any = {}
      if (categoria) filtros.categoria = categoria
      if (ativo !== null) filtros.ativo = ativo === 'true'
      result = await estoqueService.listar(ctx.userId, ctx.tenantId, filtros)
    }

    return createApiSuccess(result, 'Itens listados com sucesso')
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

    const item = await estoqueService.criar(ctx.userId, ctx.tenantId, validated.data)
    return createApiSuccess(item, 'Item criado com sucesso', 201)
  } catch (error) {
    console.error('[API] POST /estoque:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}
