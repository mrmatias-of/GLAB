import { NextResponse } from 'next/server'
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { financeiroServiceService } from '@/src/modules/financeiro'
import { UpdateFinanceiroSchema } from '@/src/modules/financeiro/schemas'

async function handleGET(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, params } = context
    const id = parseInt(params?.id as string, 10)
    if (isNaN(id)) return createApiError('ID inválido', 400)
    const result = await financeiroServiceService.obter(userId, tenantId, id)
    if (!result) return createApiError('Não encontrado', 404)
    return createApiSuccess(result, 'Obtido com sucesso')
  } catch (error) {
    console.error('[API] GET /financeiro/[id]:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro', 500)
  }
}

async function handlePUT(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, params, request } = context
    const id = parseInt(params?.id as string, 10)
    if (isNaN(id)) return createApiError('ID inválido', 400)
    const body = await request.json()
    const validated = UpdateFinanceiroSchema.safeParse(body)
    if (!validated.success) return createApiError(`Validação: ${validated.error.message}`, 400)
    const result = await financeiroServiceService.atualizar(userId, tenantId, id, validated.data)
    return createApiSuccess(result, 'Atualizado com sucesso')
  } catch (error) {
    console.error('[API] PUT /financeiro/[id]:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro', 500)
  }
}

async function handleDELETE(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, params } = context
    const id = parseInt(params?.id as string, 10)
    if (isNaN(id)) return createApiError('ID inválido', 400)
    await financeiroServiceService.deletar(userId, tenantId, id)
    return createApiSuccess(null, 'Deletado com sucesso')
  } catch (error) {
    console.error('[API] DELETE /financeiro/[id]:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro', 500)
  }
}

export const GET = withMiddleware(handleGET, { requireAuth: true, requireTenant: true, rateLimit: 'user' })
export const PUT = withMiddleware(handlePUT, { requireAuth: true, requireTenant: true, requireCsrf: true, rateLimit: 'user' })
export const DELETE = withMiddleware(handleDELETE, { requireAuth: true, requireTenant: true, requireCsrf: true, rateLimit: 'user' })
