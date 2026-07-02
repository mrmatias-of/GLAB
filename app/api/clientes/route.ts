import { NextRequest } from 'next/server'
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { clienteService } from '@/src/modules/clientes'
import { validateBody } from '@/lib/validators/schema-validator'
import { CreateClienteSchema } from '@/src/modules/clientes/schemas'

// GET: List clientes
async function handleGET(context: RequestContext) {
  const { userId, tenantId, request } = context
  
  const { searchParams } = new URL(request.url)
  const filtros: any = {}
  
  if (searchParams.has('ativo')) {
    filtros.ativo = searchParams.get('ativo') === 'true'
  }
  if (searchParams.has('cidade')) {
    filtros.cidade = searchParams.get('cidade')
  }
  if (searchParams.has('page')) {
    filtros.page = parseInt(searchParams.get('page') || '1')
  }
  if (searchParams.has('limit')) {
    filtros.limit = parseInt(searchParams.get('limit') || '10')
  }

  const clientes = await clienteService.listar(userId, tenantId, filtros)
  return createApiSuccess(clientes, 'Clientes listados com sucesso')
}

// POST: Create cliente
async function handlePOST(context: RequestContext) {
  const { userId, tenantId, request } = context
  
  const body = await request.json()
  const validated = await validateBody(body, CreateClienteSchema)
  
  if (validated.error) {
    return createApiError(validated.message, 400)
  }

  const cliente = await clienteService.criar(userId, tenantId, validated.data)
  return createApiSuccess(cliente, 'Cliente criado com sucesso', 201)
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
