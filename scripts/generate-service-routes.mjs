import fs from 'fs'
import path from 'path'

// Template para GET + POST routes
const getPostTemplate = (module, singularName, pluralName, serviceName, schemas) => `
import { NextResponse } from 'next/server'
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { ${serviceName}Service } from '@/src/modules/${module}'
import { Create${singularName}Schema, List${singularName}Schema } from '@/src/modules/${module}/schemas'

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

    // Validate with Zod
    const validated = List${singularName}Schema.safeParse(queryParams)
    if (!validated.success) {
      return createApiError(\`Validação falhou: \${validated.error.message}\`, 400)
    }

    const result = await ${serviceName}Service.listar(userId, tenantId, validated.data)
    return createApiSuccess(result, '${pluralName} listados com sucesso')
  } catch (error) {
    console.error('[API] GET /${module}:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Erro ao listar ${pluralName}',
      500
    )
  }
}

async function handlePOST(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, request } = context
    
    const body = await request.json()
    const validated = Create${singularName}Schema.safeParse(body)
    
    if (!validated.success) {
      return createApiError(\`Validação falhou: \${validated.error.message}\`, 400)
    }

    const result = await ${serviceName}Service.criar(userId, tenantId, validated.data)
    return createApiSuccess(result, '${singularName} criado com sucesso', 201)
  } catch (error) {
    console.error('[API] POST /${module}:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Erro ao criar ${singularName}',
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
`

// Template para [id] routes
const idTemplate = (module, singularName, serviceName) => `
import { NextResponse } from 'next/server'
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { ${serviceName}Service } from '@/src/modules/${module}'
import { Update${singularName}Schema } from '@/src/modules/${module}/schemas'

async function handleGET(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, params } = context
    
    if (!params?.id) {
      return createApiError('ID não fornecido', 400)
    }

    const id = parseInt(params.id as string, 10)
    if (isNaN(id)) {
      return createApiError('ID inválido', 400)
    }

    const result = await ${serviceName}Service.obter(userId, tenantId, id)
    if (!result) {
      return createApiError('Recurso não encontrado', 404)
    }

    return createApiSuccess(result, 'Recurso obtido com sucesso')
  } catch (error) {
    console.error('[API] GET /${module}/[id]:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Erro ao obter recurso',
      500
    )
  }
}

async function handlePUT(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, params, request } = context
    
    if (!params?.id) {
      return createApiError('ID não fornecido', 400)
    }

    const id = parseInt(params.id as string, 10)
    if (isNaN(id)) {
      return createApiError('ID inválido', 400)
    }

    const body = await request.json()
    const validated = Update${singularName}Schema.safeParse(body)

    if (!validated.success) {
      return createApiError(\`Validação falhou: \${validated.error.message}\`, 400)
    }

    const result = await ${serviceName}Service.atualizar(userId, tenantId, id, validated.data)
    return createApiSuccess(result, 'Recurso atualizado com sucesso')
  } catch (error) {
    console.error('[API] PUT /${module}/[id]:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Erro ao atualizar recurso',
      500
    )
  }
}

async function handleDELETE(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, params } = context
    
    if (!params?.id) {
      return createApiError('ID não fornecido', 400)
    }

    const id = parseInt(params.id as string, 10)
    if (isNaN(id)) {
      return createApiError('ID inválido', 400)
    }

    await ${serviceName}Service.deletar(userId, tenantId, id)
    return createApiSuccess(null, 'Recurso deletado com sucesso')
  } catch (error) {
    console.error('[API] DELETE /${module}/[id]:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Erro ao deletar recurso',
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
`

console.log('✓ Script ready to generate implementations')
