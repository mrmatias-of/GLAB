import { NextResponse } from 'next/server'
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { financeiroServiceService } from '@/src/modules/financeiro'
import { CreateFinanceiroSchema, ListFinanceiroSchema } from '@/src/modules/financeiro/schemas'

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

    const validated = ListFinanceiroSchema.safeParse(queryParams)
    if (!validated.success) {
      return createApiError(`Validação falhou: ${validated.error.message}`, 400)
    }

    const result = await financeiroServiceService.listar(userId, tenantId, validated.data)
    return createApiSuccess(result, 'Listados com sucesso')
  } catch (error) {
    console.error('[API] GET /financeiro:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro na requisição', 500)
  }
}

async function handlePOST(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, request } = context
    const body = await request.json()
    const validated = CreateFinanceiroSchema.safeParse(body)
    
    if (!validated.success) {
      return createApiError(`Validação falhou: ${validated.error.message}`, 400)
    }

    const result = await financeiroServiceService.criar(userId, tenantId, validated.data)
    return createApiSuccess(result, 'Criado com sucesso', 201)
  } catch (error) {
    console.error('[API] POST /financeiro:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro na requisição', 500)
  }
}

export const GET = withMiddleware(handleGET, { requireAuth: true, requireTenant: true, rateLimit: 'user' })
export const POST = withMiddleware(handlePOST, { requireAuth: true, requireTenant: true, requireCsrf: true, rateLimit: 'create' })
