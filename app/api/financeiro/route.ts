import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { financeiroService } from '@/src/modules/financeiro'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { validateBody } from '@/lib/validators/schema-validator'
import { CreateFinanceiroSchema } from '@/src/modules/financeiro/schemas'
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
    const tipo = searchParams.get('tipo')
    const status = searchParams.get('status')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const dashboard = searchParams.get('dashboard')

    if (dashboard === 'true') {
      const result = await financeiroService.obterDashboard(ctx.userId, ctx.tenantId)
      return createApiSuccess(result, 'Dashboard obtido com sucesso')
    }

    const filtros: any = {}
    if (tipo) filtros.tipo = tipo
    if (status) filtros.status = status
    if (dataInicio && dataFim) {
      filtros.dataInicio = new Date(dataInicio)
      filtros.dataFim = new Date(dataFim)
    }

    const transacoes = await financeiroService.listar(ctx.userId, ctx.tenantId, filtros)
    return createApiSuccess(transacoes, 'Transações listadas com sucesso')
  } catch (error) {
    console.error('[API] GET /financeiro:', error)
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
    const validated = await validateBody(body, CreateFinanceiroSchema)
    if (validated.error) return createApiError(validated.message, 400)

    const transacao = await financeiroService.criar(ctx.userId, ctx.tenantId, validated.data)
    return createApiSuccess(transacao, 'Transação criada com sucesso', 201)
  } catch (error) {
    console.error('[API] POST /financeiro:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}
