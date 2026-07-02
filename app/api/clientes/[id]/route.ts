import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { clienteService } from '@/src/modules/clientes'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { validateBody } from '@/lib/validators/schema-validator'
import { UpdateClienteSchema } from '@/src/modules/clientes/schemas'
import { checkRateLimit } from '@/lib/security/rate-limit'

// Helper to extract tenant
async function getRequestContext() {
  const hdrs = await headers()
  const session = await auth.api.getSession({ headers: hdrs })
  
  if (!session?.user) {
    return null
  }

  return {
    userId: session.user.id,
    tenantId: session.user.tenantId || 'default',
    session,
    headers: hdrs,
  }
}

export async function GET(
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

    const { id } = await params
    const cliente = await clienteService.obter(ctx.userId, ctx.tenantId, parseInt(id))

    if (!cliente) {
      return createApiError('Cliente not found', 404)
    }

    return createApiSuccess(cliente, 'Cliente obtido com sucesso')
  } catch (error) {
    console.error('[API] GET /clientes/[id]:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}

export async function PUT(
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
    const body = await req.json()
    const validated = await validateBody(body, UpdateClienteSchema)

    if (validated.error) {
      return createApiError(validated.message, 400)
    }

    const cliente = await clienteService.atualizar(
      ctx.userId,
      ctx.tenantId,
      parseInt(id),
      validated.data
    )

    return createApiSuccess(cliente, 'Cliente atualizado com sucesso')
  } catch (error) {
    console.error('[API] PUT /clientes/[id]:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}

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
