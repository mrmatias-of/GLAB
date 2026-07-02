# Zod Validation Guide

## Overview

All API routes use Zod for request validation. This prevents invalid data from reaching services and databases.

## Structure

```
src/modules/*/schemas/index.ts  - Zod schemas for each module
lib/validators/schema-validator.ts  - Validation utilities
```

## Usage in API Routes

### 1. Validate POST Body

```typescript
import { NextRequest } from 'next/server'
import { validateBody } from '@/lib/validators/schema-validator'
import { CreateClienteSchema } from '@/src/modules/clientes/schemas'
import { successResponse } from '@/lib/middleware/api-response'

export async function POST(req: NextRequest) {
  // Validate request body
  const validation = await validateBody(req, CreateClienteSchema)
  
  if (!validation.success) {
    return validation.response // Returns 400 with error details
  }

  // Now data is type-safe
  const cliente = await clienteService.criar(userId, validation.data)
  
  return successResponse(cliente, 'Cliente criado', 201)
}
```

### 2. Validate Query Parameters

```typescript
import { validateQuery } from '@/lib/validators/schema-validator'
import { GetClienteSchema } from '@/src/modules/clientes/schemas'

export async function GET(req: NextRequest) {
  const validation = await validateQuery(req.url, GetClienteSchema)
  
  if (!validation.success) {
    return validation.response
  }

  const clientes = await clienteService.listar(userId, validation.data)
  
  return successResponse(clientes)
}
```

### 3. Validate URL Parameters

```typescript
import { validateParams } from '@/lib/validators/schema-validator'
import { ClienteIdSchema } from '@/src/modules/clientes/schemas'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Convert string ID to number
  const validation = await validateParams(
    { id: parseInt(params.id) },
    ClienteIdSchema
  )
  
  if (!validation.success) {
    return validation.response
  }

  const cliente = await clienteService.obter(userId, validation.data.id)
  
  return successResponse(cliente)
}
```

## Schema Definition

```typescript
import { z } from 'zod'

// Simple schema
export const CreateClienteSchema = z.object({
  nome: z.string().min(2).max(255),
  email: z.string().email(),
  telefone: z.string().optional(),
})

// With transformations
export const PriceSchema = z.string()
  .transform(val => parseFloat(val))
  .refine(val => val > 0, { message: 'Price must be positive' })

// Discriminated union
export const TransactionSchema = z.discriminatedUnion('tipo', [
  z.object({
    tipo: z.literal('receita'),
    valor: z.number().positive(),
  }),
  z.object({
    tipo: z.literal('despesa'),
    valor: z.number().positive(),
  }),
])

// Extract type
type CreateClienteInput = z.infer<typeof CreateClienteSchema>
```

## Common Patterns

### Partial Updates

```typescript
export const UpdateClienteSchema = CreateClienteSchema.partial()

// Only required fields for updates are specified
```

### Extending Schemas

```typescript
export const QuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  sortBy: z.string().optional(),
})
  .extend({
    // Add more fields
    status: z.string().optional(),
  })
```

### Conditional Validation

```typescript
export const OrderSchema = z.object({
  type: z.enum(['digital', 'physical']),
  email: z.string().email(),
})
  .refine(data => data.type === 'digital' || data.email, {
    message: 'Email required for physical orders',
    path: ['email'],
  })
```

## Error Responses

Validation errors return 400 with details:

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "nome: String must contain at least 2 character(s), email: Invalid email"
}
```

## Best Practices

1. Create reusable schemas in `src/shared/schemas`
2. Use module-specific schemas in `src/modules/*/schemas`
3. Always validate before passing to services
4. Use proper error messages
5. Document expected response types
6. Keep schemas close to where they're used

## Testing Validation

```bash
# Test with invalid data
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome": "A"}' # Too short

# Response: 400 with validation error

# Test with valid data
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome": "Valid Name", "email": "test@example.com"}'

# Response: 201 with created client
```

## Migration from Current Code

Current code validation:
```typescript
if (!dados.nome || dados.nome.length < 2) {
  throw new Error('Invalid name')
}
```

Should become:
```typescript
const validation = await validateRequest(dados, CreateClienteSchema)
if (!validation.success) {
  return errorResponse('Validation failed', 400)
}
```

## References

- Zod docs: https://zod.dev
- `lib/validators/schema-validator.ts` - Utilities
- `src/shared/schemas/common.schemas.ts` - Common schemas
- `src/modules/*/schemas/index.ts` - Module schemas
