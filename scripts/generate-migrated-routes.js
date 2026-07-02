#!/usr/bin/env node

/**
 * Auto-generates migrated route files with middleware integrated
 * Usage: node scripts/generate-migrated-routes.js app/api/MODULE/route.ts
 */

const fs = require('fs');
const path = require('path');

function inferModuleInfo(filePath) {
  // Extract module from path like app/api/estoque/route.ts
  const parts = filePath.split('/');
  const module = parts[2]; // 'estoque', 'clientes', etc

  const moduleMap = {
    clientes: { service: 'clienteService', schema: 'ClienteSchema' },
    estoque: { service: 'estoqueService', schema: 'EstoqueSchema' },
    ordens: { service: 'ordemService', schema: 'OrdemSchema' },
    'ordens-servico': { service: 'ordemService', schema: 'OrdemSchema' },
    financeiro: { service: 'financeiroService', schema: 'FinanceiroSchema' },
    rh: { service: 'rhService', schema: 'RhSchema' },
    comissoes: { service: 'comissoesService', schema: 'ComissoesSchema' },
    servicos: { service: 'servicosService', schema: 'ServicosSchema' },
    tecnicos: { service: 'tecnicosService', schema: 'TecnicosSchema' },
  };

  return moduleMap[module] || { service: 'genericService', schema: 'GenericSchema' };
}

function generateRouteMigration(filePath) {
  const info = inferModuleInfo(filePath);
  const isDynamic = filePath.includes('[id]');

  let template = `import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ${info.service} } from '@/src/modules/${filePath.split('/')[2]}'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { validateBody } from '@/lib/validators/schema-validator'
import { Create${info.schema}, Update${info.schema} } from '@/src/modules/${filePath.split('/')[2]}/schemas'
import { checkRateLimit } from '@/lib/security/rate-limit'

async function getRequestContext() {
  const hdrs = await headers()
  const session = await auth.api.getSession({ headers: hdrs })
  if (!session?.user) return null
  return {
    userId: session.user.id,
    tenantId: session.user.tenantId || 'default',
    session,
    headers: hdrs,
  }
}

export async function GET(req: NextRequest${isDynamic ? ', { params }' : ''}) {
  try {
    const rl = await checkRateLimit(req, 'user')
    if (!rl.allowed) return createApiError('Rate limit exceeded', 429)

    const ctx = await getRequestContext()
    if (!ctx) return createApiError('Unauthorized', 401)

    // TODO: Implement GET logic
    // Example:
    // const items = await ${info.service}.listar(ctx.userId, ctx.tenantId)
    // return createApiSuccess(items, 'Items listados com sucesso')
    
    return createApiSuccess([], 'GET not implemented', 501)
  } catch (error) {
    console.error('[API] GET:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}

export async function POST(req: NextRequest${isDynamic ? ', { params }' : ''}) {
  try {
    const rl = await checkRateLimit(req, 'create')
    if (!rl.allowed) return createApiError('Rate limit exceeded', 429)

    const ctx = await getRequestContext()
    if (!ctx) return createApiError('Unauthorized', 401)

    const csrfToken = req.headers.get('x-csrf-token')
    if (!csrfToken) return createApiError('CSRF token required', 403)

    const body = await req.json()
    const validated = await validateBody(body, Create${info.schema})
    if (validated.error) return createApiError(validated.message, 400)

    // TODO: Implement POST logic
    
    return createApiSuccess(null, 'POST not implemented', 501)
  } catch (error) {
    console.error('[API] POST:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}

export async function PUT(req: NextRequest${isDynamic ? ', { params }' : ''}) {
  try {
    const rl = await checkRateLimit(req, 'user')
    if (!rl.allowed) return createApiError('Rate limit exceeded', 429)

    const ctx = await getRequestContext()
    if (!ctx) return createApiError('Unauthorized', 401)

    const csrfToken = req.headers.get('x-csrf-token')
    if (!csrfToken) return createApiError('CSRF token required', 403)

    const body = await req.json()
    const validated = await validateBody(body, Update${info.schema})
    if (validated.error) return createApiError(validated.message, 400)

    // TODO: Implement PUT logic
    
    return createApiSuccess(null, 'PUT not implemented', 501)
  } catch (error) {
    console.error('[API] PUT:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}

export async function DELETE(req: NextRequest${isDynamic ? ', { params }' : ''}) {
  try {
    const rl = await checkRateLimit(req, 'user')
    if (!rl.allowed) return createApiError('Rate limit exceeded', 429)

    const ctx = await getRequestContext()
    if (!ctx) return createApiError('Unauthorized', 401)

    const csrfToken = req.headers.get('x-csrf-token')
    if (!csrfToken) return createApiError('CSRF token required', 403)

    // TODO: Implement DELETE logic
    
    return createApiSuccess(null, 'DELETE not implemented', 501)
  } catch (error) {
    console.error('[API] DELETE:', error)
    return createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}`;

  return template;
}

// Main
const targetFile = process.argv[2];
if (!targetFile) {
  console.error('Usage: node scripts/generate-migrated-routes.js <route-path>');
  process.exit(1);
}

const migrated = generateRouteMigration(targetFile);
console.log(migrated);

// Optionally write to file with --write flag
if (process.argv[3] === '--write') {
  fs.writeFileSync(targetFile, migrated);
  console.error(`✓ Wrote migrated route to ${targetFile}`);
}
