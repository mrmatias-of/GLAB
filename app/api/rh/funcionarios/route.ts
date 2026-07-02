import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { rhService } from '@/src/modules/rh'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { validateBody } from '@/lib/validators/schema-validator'
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
    const ativo = searchParams.get('ativo')
    const departamento = searchParams.get('departamento')

    const filtros: any = {}
    if (ativo !== null) filtros.ativo = ativo === 'true'
    if (departamento) filtros.departamento = departamento

    const funcionarios = await rhService.listarFuncionarios(ctx.userId, ctx.tenantId, filtros)
    return createApiSuccess(funcionarios, 'Funcionários listados com sucesso')
  } catch (error) {
    console.error('[API] GET /rh/funcionarios:', error)
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
    const funcionario = await rhService.criarFuncionario(ctx.userId, ctx.tenantId, body)
    return createApiSuccess(funcionario, 'Funcionário criado com sucesso', 201)
  } catch (error) {
    console.error('[API] POST /rh/funcionarios:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}
