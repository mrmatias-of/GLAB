# Arquitetura DDD - src/modules

## Estrutura

```
src/
├── modules/           # Domain-oriented modules
│   ├── auth/         # Authentication & Sessions
│   ├── master/       # SaaS Platform Management
│   ├── clientes/     # CRM
│   ├── ordens/       # Orders/Service Orders
│   ├── estoque/      # Inventory
│   ├── financeiro/   # Financial Management
│   ├── rh/          # HR & Payroll
│   ├── shared/      # Shared types, errors, etc
│   └── index.ts     # Barrel exports
├── shared/          # Global utilities
│   ├── middleware/
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   └── errors/
└── config/          # Configuration

app/                # Next.js pages & APIs (unchanged)
```

## Padrão por Module

Cada module segue o padrão:

```
module/
├── types/           # TypeScript interfaces
├── schemas/         # Zod validation
├── repositories/    # Data access layer
├── services/        # Business logic
├── controllers/     # API handlers
└── index.ts        # Barrel exports
```

## Exemplo de Uso

```typescript
// Import de um module
import { auth, clientes, rh } from '@/src/modules'

// Type safety
const user: auth.types.UserSession = { ... }

// Services
const service = new clientes.services.ClienteService(repo)
```

## Benefícios

- Clean Architecture
- Clear separation of concerns
- Easy to test
- Scalable structure
- Type-safe
- Easy navigation
