import { NextResponse } from 'next/server'
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { ordemServiceService } from '@/src/modules/ordens-servico'
import { CreateOrdemSchema, ListOrdemSchema } from '@/src/modules/ordens-servico/schemas'

async function handleGET(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, request } = context
    const { searchParams } = new URL(request.url)
    
    const queryParams: any = {}
    for (const [key, value] of searchParams.entries()) {
      if (value === 'true') queryParams[key] = true
      else if (value === 'false') queryParams[key] = false
      else queryParams[key] = value
    }

    const validated = ListOrdemSchema.safeParse(queryParams)
    if (!validated.success) {
      return createApiError(`Validação falhou: ${validated.error.message}`, 400)
    }

    const result = await ordemServiceService.listar(userId, tenantId, validated.data)
    return createApiSuccess(result, 'Listados com sucesso')
  } catch (error) {
    console.error('[API] GET /ordens-servico:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro na requisição', 500)
  }
}

async function handlePOST(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, request } = context
    const body = await request.json()
    const validated = CreateOrdemSchema.safeParse(body)
    
    if (!validated.success) {
      return createApiError(`Validação falhou: ${validated.error.message}`, 400)
    }

    const result = await ordemServiceService.criar(userId, tenantId, validated.data)
    return createApiSuccess(result, 'Criado com sucesso', 201)
  } catch (error) {
    console.error('[API] POST /ordens-servico:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro na requisição', 500)
  }
}

export const GET = withMiddleware(handleGET, { requireAuth: true, requireTenant: true, rateLimit: 'user' })
export const POST = withMiddleware(handlePOST, { requireAuth: true, requireTenant: true, requireCsrf: true, rateLimit: 'create' })
