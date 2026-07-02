import { NextResponse } from 'next/server'
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { clienteService } from '@/src/modules/clientes'
import { CreateClienteSchema, ListClientesSchema } from '@/src/modules/clientes/schemas'

async function handleGET(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, request } = context
    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const queryParams = {
      ativo: searchParams.get('ativo') ? searchParams.get('ativo') === 'true' : undefined,
      cidade: searchParams.get('cidade') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    }

    // Validate with Zod
    const validated = ListClientesSchema.safeParse(queryParams)
    if (!validated.success) {
      return createApiError(`Validação falhou: ${validated.error.message}`, 400)
    }

    // Call service with validated data
    const result = await clienteService.listar(userId, tenantId, validated.data)
    return createApiSuccess(result, 'Clientes listados com sucesso')
  } catch (error) {
    console.error('[API] GET /clientes:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Erro ao listar clientes',
      500
    )
  }
}

async function handlePOST(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, request } = context
    
    const body = await request.json()
    const validated = CreateClienteSchema.safeParse(body)
    
    if (!validated.success) {
      return createApiError(`Validação falhou: ${validated.error.message}`, 400)
    }

    const cliente = await clienteService.criar(userId, tenantId, validated.data)
    return createApiSuccess(cliente, 'Cliente criado com sucesso', 201)
  } catch (error) {
    console.error('[API] POST /clientes:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Erro ao criar cliente',
      500
    )
  }
}

export const GET = withMiddleware(handleGET, {
  requireAuth: true,
  requireTenant: true,
  requireCsrf: false,
  rateLimit: 'user',
})

export const POST = withMiddleware(handlePOST, {
  requireAuth: true,
  requireTenant: true,
  requireCsrf: true,
  rateLimit: 'create',
})
