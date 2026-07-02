# Auth Module (DDD Pattern)

Módulo centralizado de autenticação seguindo Domain-Driven Design (DDD).

## Estrutura

```
src/modules/auth/
├── config.ts                    # Better Auth configuration
├── index.ts                     # Barrel exports
├── README.md                    # Esta documentação
├── controllers/
│   └── auth.controller.ts       # API route handlers
├── repositories/
│   └── auth.repository.ts       # Data access layer
├── schemas/
│   └── index.ts                 # Zod validation schemas
├── services/
│   └── auth.service.ts          # Business logic
└── types/
    └── index.ts                 # TypeScript types
```

## Usando o Auth Module

### 1. Importar do module
```typescript
import { auth, AuthRepository, AuthService } from '@/src/modules/auth'
```

### 2. Usar no controller
```typescript
import { auth } from '@/src/modules/auth'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  
  return Response.json(session)
}
```

### 3. Usar repository para data access
```typescript
import { AuthRepository } from '@/src/modules/auth'

const authRepo = new AuthRepository()
const user = await authRepo.findUserByEmail('user@example.com', tenantId)
```

## API Endpoints

- `POST /api/auth/signup` - Criar nova conta
- `POST /api/auth/reset-password` - Solicitar reset de senha
- `POST /api/auth/confirm-reset-password` - Confirmar novo password

## Features

- Better Auth integration
- Email/Password authentication
- Session management (7 days)
- Tenant isolation
- Type-safe with TypeScript
- Zod validation for inputs
- DDD repository pattern

## Environment Variables

```
BETTER_AUTH_SECRET=<random-string>
BETTER_AUTH_URL=<base-url>
```

## Pattern

This module follows the DDD pattern:
- **Types**: Domain models
- **Schemas**: Input validation (Zod)
- **Repository**: Data access
- **Service**: Business logic
- **Controller**: HTTP handlers
- **Config**: Module configuration
