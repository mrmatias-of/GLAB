#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

// Templates
const getPostTemplate = (module, singularName, serviceName) => `import { NextResponse } from 'next/server'
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

    const validated = List${singularName}Schema.safeParse(queryParams)
    if (!validated.success) {
      return createApiError(\`Validação falhou: \${validated.error.message}\`, 400)
    }

    const result = await ${serviceName}Service.listar(userId, tenantId, validated.data)
    return createApiSuccess(result, 'Listados com sucesso')
  } catch (error) {
    console.error('[API] GET /${module}:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro na requisição', 500)
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
    return createApiSuccess(result, 'Criado com sucesso', 201)
  } catch (error) {
    console.error('[API] POST /${module}:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro na requisição', 500)
  }
}

export const GET = withMiddleware(handleGET, { requireAuth: true, requireTenant: true, rateLimit: 'user' })
export const POST = withMiddleware(handlePOST, { requireAuth: true, requireTenant: true, requireCsrf: true, rateLimit: 'create' })
`

const idTemplate = (module, singularName, serviceName) => `import { NextResponse } from 'next/server'
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { ${serviceName}Service } from '@/src/modules/${module}'
import { Update${singularName}Schema } from '@/src/modules/${module}/schemas'

async function handleGET(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, params } = context
    const id = parseInt(params?.id as string, 10)
    if (isNaN(id)) return createApiError('ID inválido', 400)
    const result = await ${serviceName}Service.obter(userId, tenantId, id)
    if (!result) return createApiError('Não encontrado', 404)
    return createApiSuccess(result, 'Obtido com sucesso')
  } catch (error) {
    console.error('[API] GET /${module}/[id]:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro', 500)
  }
}

async function handlePUT(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, params, request } = context
    const id = parseInt(params?.id as string, 10)
    if (isNaN(id)) return createApiError('ID inválido', 400)
    const body = await request.json()
    const validated = Update${singularName}Schema.safeParse(body)
    if (!validated.success) return createApiError(\`Validação: \${validated.error.message}\`, 400)
    const result = await ${serviceName}Service.atualizar(userId, tenantId, id, validated.data)
    return createApiSuccess(result, 'Atualizado com sucesso')
  } catch (error) {
    console.error('[API] PUT /${module}/[id]:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro', 500)
  }
}

async function handleDELETE(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, params } = context
    const id = parseInt(params?.id as string, 10)
    if (isNaN(id)) return createApiError('ID inválido', 400)
    await ${serviceName}Service.deletar(userId, tenantId, id)
    return createApiSuccess(null, 'Deletado com sucesso')
  } catch (error) {
    console.error('[API] DELETE /${module}/[id]:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro', 500)
  }
}

export const GET = withMiddleware(handleGET, { requireAuth: true, requireTenant: true, rateLimit: 'user' })
export const PUT = withMiddleware(handlePUT, { requireAuth: true, requireTenant: true, requireCsrf: true, rateLimit: 'user' })
export const DELETE = withMiddleware(handleDELETE, { requireAuth: true, requireTenant: true, requireCsrf: true, rateLimit: 'user' })
`

// Define Priority 1 modules
const priority1Routes = [
  { module: 'estoque', singular: 'Estoque', service: 'estoqueService' },
  { module: 'ordens-servico', singular: 'Ordem', service: 'ordemService' },
  { module: 'financeiro', singular: 'Financeiro', service: 'financeiroService' },
]

console.log('📝 Refactoring Priority 1 routes...\n')

for (const { module, singular, service } of priority1Routes) {
  const baseRoute = path.join(projectRoot, `app/api/${module}/route.ts`)
  const idRoute = path.join(projectRoot, `app/api/${module}/[id]/route.ts`)
  
  if (fs.existsSync(baseRoute)) {
    fs.writeFileSync(baseRoute, getPostTemplate(module, singular, service))
    console.log(`✓ ${module}/route.ts`)
  }
  
  if (fs.existsSync(idRoute)) {
    fs.writeFileSync(idRoute, idTemplate(module, singular, service))
    console.log(`✓ ${module}/[id]/route.ts`)
  }
}

console.log('\n✅ Priority 1 routes refactored')
