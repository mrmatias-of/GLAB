# API Route Template with Middleware Integration

Use this template for all API routes to ensure consistent middleware application.

## Template 1: Simple GET/POST Route (Clientes example)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { clienteService } from '@/src/modules/clientes'
import { CreateClienteSchema, UpdateClienteSchema } from '@/src/modules/clientes/schemas'
import { validateBody, validateQuery } from '@/lib/validators/schema-validator'

// GET: List clientes
async function handleGET(context: RequestContext) {
  const { userId, tenantId, request } = context
  
  // Validate query parameters
  const { searchParams } = new URL(request.url)
  const query = {
    ativo: searchParams.get('ativo'),
    cidade: searchParams.get('cidade'),
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
  }

  const clientes = await clienteService.listar(userId, tenantId, query)
  return createApiSuccess(clientes, 'Clientes listados com sucesso')
}

// POST: Create cliente
async function handlePOST(context: RequestContext) {
  const { userId, tenantId, request } = context
  
  const body = await request.json()
  
  // Validate body with Zod
  const validated = await validateBody(body, CreateClienteSchema)
  if (validated.error) {
    return createApiError(validated.error, 400)
  }

  const cliente = await clienteService.criar(userId, tenantId, validated.data)
  return createApiSuccess(cliente, 'Cliente criado com sucesso', 201)
}

// Export wrapped handlers
export const GET = withMiddleware(handleGET, {
  requireAuth: true,
  requireTenant: true,
  requireCsrf: false, // GET doesn't need CSRF
  rateLimit: 'user',
})

export const POST = withMiddleware(handlePOST, {
  requireAuth: true,
  requireTenant: true,
  requireCsrf: true, // POST needs CSRF
  rateLimit: 'create',
})
```

## Template 2: Resource ID Route ([id]/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { clienteService } from '@/src/modules/clientes'
import { UpdateClienteSchema } from '@/src/modules/clientes/schemas'
import { validateBody, validateParams } from '@/lib/validators/schema-validator'

// GET: Get single cliente
async function handleGET(context: RequestContext) {
  const { userId, tenantId, request } = context
  
  const { params } = context.request
  const id = params?.id
  
  if (!id) return createApiError('ID required', 400)

  const cliente = await clienteService.obter(userId, tenantId, id)
  if (!cliente) {
    return createApiError('Cliente not found', 404)
  }

  return createApiSuccess(cliente, 'Cliente obtido com sucesso')
}

// PUT: Update cliente
async function handlePUT(context: RequestContext) {
  const { userId, tenantId, request } = context
  
  const { params } = context.request
  const id = params?.id
  
  if (!id) return createApiError('ID required', 400)

  const body = await request.json()
  const validated = await validateBody(body, UpdateClienteSchema)
  
  if (validated.error) {
    return createApiError(validated.error, 400)
  }

  const cliente = await clienteService.atualizar(userId, tenantId, id, validated.data)
  return createApiSuccess(cliente, 'Cliente atualizado com sucesso')
}

// DELETE: Delete cliente
async function handleDELETE(context: RequestContext) {
  const { userId, tenantId, request } = context
  
  const { params } = context.request
  const id = params?.id
  
  if (!id) return createApiError('ID required', 400)

  await clienteService.deletar(userId, tenantId, id)
  return createApiSuccess(null, 'Cliente deletado com sucesso')
}

export const GET = withMiddleware(handleGET, {
  requireAuth: true,
  requireTenant: true,
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
```

## Template 3: Public Route (No Auth)

```typescript
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess } from '@/lib/middleware/api-response'

async function handleGET(context: RequestContext) {
  return createApiSuccess({ status: 'ok' }, 'Health check passed')
}

export const GET = withMiddleware(handleGET, {
  public: true, // No auth required
  requireCsrf: false,
  rateLimit: 'global',
})
```

## Template 4: Login Route (Special Rate Limit)

```typescript
import { withMiddleware, RequestContext } from '@/lib/middleware/route-handler'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'

async function handlePOST(context: RequestContext) {
  const body = await context.request.json()
  
  // Login logic
  // ...
  
  return createApiSuccess({ token: '...' }, 'Login successful', 200)
}

export const POST = withMiddleware(handlePOST, {
  public: true,
  requireCsrf: true,
  rateLimit: 'login', // Special brute-force protection
})
```

## Key Patterns

### Extracting tenantId from params
```typescript
// In [id]/route.ts, tenantId comes from context
const { tenantId } = context
```

### Calling services with tenant context
```typescript
// Always pass userId and tenantId to services
const result = await clienteService.listar(userId, tenantId, filters)
```

### Error responses
```typescript
import { createApiError, createApiSuccess } from '@/lib/middleware/api-response'

// Error with status code
return createApiError('Not found', 404)

// Success with status code
return createApiSuccess(data, 'Success message', 200)
```

### Validation
```typescript
import { validateBody, validateQuery, validateParams } from '@/lib/validators/schema-validator'
import { CreateClienteSchema } from '@/src/modules/clientes/schemas'

const validated = await validateBody(body, CreateClienteSchema)
if (validated.error) {
  return createApiError(validated.error, 400)
}

// Use validated.data
```

## Migration Checklist

For each route file:
- [ ] Import withMiddleware and RequestContext
- [ ] Import createApiSuccess/createApiError
- [ ] Split GET/POST/PUT/DELETE into separate async functions
- [ ] Extract userId and tenantId from context
- [ ] Add validateBody for POST/PUT
- [ ] Add validateQuery for GET filters
- [ ] Call services with (userId, tenantId, ...)
- [ ] Wrap with withMiddleware()
- [ ] Add appropriate rateLimit strategy
- [ ] Test the route
