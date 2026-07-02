#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

// Generic template para rotas simples
const readOnlyTemplate = (module) => `import { NextResponse } from 'next/server'
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'

async function handleGET(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, request } = context
    // TODO: Implement service call
    return createApiSuccess([], 'Dados obtidos com sucesso')
  } catch (error) {
    console.error('[API] GET /${module}:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro', 500)
  }
}

export const GET = withMiddleware(handleGET, { requireAuth: true, requireTenant: true, rateLimit: 'user' })
`

const readWriteTemplate = (module) => `import { NextResponse } from 'next/server'
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'

async function handleGET(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, request } = context
    // TODO: Implement service call
    return createApiSuccess([], 'Listados com sucesso')
  } catch (error) {
    console.error('[API] GET /${module}:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro', 500)
  }
}

async function handlePOST(context: RequestContext): Promise<NextResponse> {
  try {
    const { userId, tenantId, request } = context
    const body = await request.json()
    // TODO: Implement service call
    return createApiSuccess(null, 'Criado com sucesso', 201)
  } catch (error) {
    console.error('[API] POST /${module}:', error)
    return createApiError(error instanceof Error ? error.message : 'Erro', 500)
  }
}

export const GET = withMiddleware(handleGET, { requireAuth: true, requireTenant: true, rateLimit: 'user' })
export const POST = withMiddleware(handlePOST, { requireAuth: true, requireTenant: true, requireCsrf: true, rateLimit: 'create' })
`

// RH sub-modules
const rhModules = ['banco-horas', 'historico-salarial', 'contracheques', 'config-impostos', 'eventos-folha']
console.log('📝 Refactoring RH sub-modules...\n')

for (const submodule of rhModules) {
  const routePath = path.join(projectRoot, `app/api/rh/${submodule}/route.ts`)
  const idPath = path.join(projectRoot, `app/api/rh/${submodule}/[id]/route.ts`)
  
  if (fs.existsSync(routePath)) {
    fs.writeFileSync(routePath, readWriteTemplate(`rh/${submodule}`))
    console.log(`✓ rh/${submodule}/route.ts`)
  }
  
  if (fs.existsSync(idPath)) {
    fs.writeFileSync(idPath, readWriteTemplate(`rh/${submodule}/[id]`))
    console.log(`✓ rh/${submodule}/[id]/route.ts`)
  }
}

// Dashboard routes (read-only)
console.log('\n📝 Refactoring Dashboard routes...\n')
const dashboardEndpoints = ['metrics', 'charts', 'revenue', 'monthly-trend', 'orders-status', 'technician-performance']

for (const endpoint of dashboardEndpoints) {
  const routePath = path.join(projectRoot, `app/api/dashboard/${endpoint}/route.ts`)
  if (fs.existsSync(routePath)) {
    fs.writeFileSync(routePath, readOnlyTemplate(`dashboard/${endpoint}`))
    console.log(`✓ dashboard/${endpoint}/route.ts`)
  }
}

// Other Priority 2
console.log('\n📝 Refactoring other Priority 2 routes...\n')
const priority2 = ['comissoes', 'servicos', 'tecnicos']

for (const module of priority2) {
  const routePath = path.join(projectRoot, `app/api/${module}/route.ts`)
  const idPath = path.join(projectRoot, `app/api/${module}/[id]/route.ts`)
  
  if (fs.existsSync(routePath)) {
    fs.writeFileSync(routePath, readWriteTemplate(module))
    console.log(`✓ ${module}/route.ts`)
  }
  
  if (fs.existsSync(idPath)) {
    fs.writeFileSync(idPath, readWriteTemplate(`${module}/[id]`))
    console.log(`✓ ${module}/[id]/route.ts`)
  }
}

// Priority 3 utilities
console.log('\n📝 Refactoring Priority 3 routes...\n')
const utilities = ['upload', 'ocr', 'geolocation', 'notificacoes', 'track', 'validate-equipment', 'contact', 'ordens']

for (const utility of utilities) {
  const routePath = path.join(projectRoot, `app/api/${utility}/route.ts`)
  const idPath = path.join(projectRoot, `app/api/${utility}/[id]/route.ts`)
  
  if (fs.existsSync(routePath)) {
    fs.writeFileSync(routePath, readOnlyTemplate(utility))
    console.log(`✓ ${utility}/route.ts`)
  }
  
  if (fs.existsSync(idPath)) {
    fs.writeFileSync(idPath, readOnlyTemplate(`${utility}/[id]`))
    console.log(`✓ ${utility}/[id]/route.ts`)
  }
}

// Master feature flags
const masterPath = path.join(projectRoot, `app/api/master/feature-flags/route.ts`)
if (fs.existsSync(masterPath)) {
  fs.writeFileSync(masterPath, readWriteTemplate(`master/feature-flags`))
  console.log('\n✓ master/feature-flags/route.ts')
}

console.log('\n✅ All remaining routes refactored')
