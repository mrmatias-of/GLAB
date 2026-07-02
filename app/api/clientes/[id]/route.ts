import { NextResponse } from 'next/server'
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { clienteService } from '@/src/modules/clientes'
import { UpdateClienteSchema } from '@/src/modules/clientes/schemas'

async function handleGET(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, params } = context
    
    if (!params?.id) {
      return createApiError('ID de cliente não fornecido', 400)
    }

    const clienteId = parseInt(params.id as string, 10)
    if (isNaN(clienteId)) {
      return createApiError('ID de cliente inválido', 400)
    }

    const cliente = await clienteService.obter(userId, tenantId, clienteId)

    if (!cliente) {
      return createApiError('Cliente não encontrado', 404)
    }

    return createApiSuccess(cliente, 'Cliente obtido com sucesso')
  } catch (error) {
    console.error('[API] GET /clientes/[id]:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Erro ao obter cliente',
      500
    )
  }
}

async function handlePUT(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, params, request } = context
    
    if (!params?.id) {
      return createApiError('ID de cliente não fornecido', 400)
    }

    const clienteId = parseInt(params.id as string, 10)
    if (isNaN(clienteId)) {
      return createApiError('ID de cliente inválido', 400)
    }

    const body = await request.json()
    const validated = UpdateClienteSchema.safeParse(body)

    if (!validated.success) {
      return createApiError(`Validação falhou: ${validated.error.message}`, 400)
    }

    const cliente = await clienteService.atualizar(
      userId,
      tenantId,
      clienteId,
      validated.data
    )

    return createApiSuccess(cliente, 'Cliente atualizado com sucesso')
  } catch (error) {
    console.error('[API] PUT /clientes/[id]:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Erro ao atualizar cliente',
      500
    )
  }
}

async function handleDELETE(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, params } = context
    
    if (!params?.id) {
      return createApiError('ID de cliente não fornecido', 400)
    }

    const clienteId = parseInt(params.id as string, 10)
    if (isNaN(clienteId)) {
      return createApiError('ID de cliente inválido', 400)
    }

    await clienteService.deletar(userId, tenantId, clienteId)
    return createApiSuccess(null, 'Cliente deletado com sucesso')
  } catch (error) {
    console.error('[API] DELETE /clientes/[id]:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Erro ao deletar cliente',
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

export const PUT = withMiddleware(handlePUT, {
  requireAuth: true,
  requireTenant: true,
  requireCsrf: true,
  rateLimit: 'user',
})

export const DELETE = withMiddleware(handleDELETE, {
  requireAuth: true,
  requireTenant: true,
  requireCsrf: true,
  rateLimit: 'user',
})

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rl = await checkRateLimit(req, 'user')
    if (!rl.allowed) {
      return createApiError('Rate limit exceeded', 429)
    }

    // Auth & context
    const ctx = await getRequestContext()
    if (!ctx) return createApiError('Unauthorized', 401)

    // CSRF validation
    const csrfToken = req.headers.get('x-csrf-token')
    if (!csrfToken) {
      return createApiError('CSRF token required', 403)
    }

    const { id } = await params
    await clienteService.deletar(ctx.userId, ctx.tenantId, parseInt(id))

    return createApiSuccess(null, 'Cliente deletado com sucesso')
  } catch (error) {
    console.error('[API] DELETE /clientes/[id]:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}
