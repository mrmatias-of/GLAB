# Master Module (DDD Pattern)

Módulo centralizado para gerenciamento de multi-tenant SaaS.

## Estrutura

```
src/modules/master/
├── README.md                    # Esta documentação
├── index.ts                     # Barrel exports
├── controllers/                 # API handlers
├── repositories/
│   └── master.repository.ts     # Data access layer
├── schemas/                     # Zod validation
├── services/                    # Business logic
└── types/
    └── index.ts                 # TypeScript types
```

## Responsabilidades

- **Tenants Management**: Criar, atualizar, listar empresas (tenants)
- **Plans Management**: Gerenciar planos e preços
- **Feature Flags**: Ativar/desativar módulos por plano
- **Subscriptions**: Gerenciar assinaturas de clientes
- **Audit**: Registrar ações no master

## Types

- `Tenant`: Empresa/cliente usando o SaaS
- `Plan`: Plano de preço/subscription
- `FeatureFlag`: Módulos disponíveis por plano
- `Subscription`: Ativa subscripção de tenant
- `MasterUser`: Usuários com acesso admin

## Repository Methods

### Tenant
- `findTenantBySlug(slug)` - Buscar por slug
- `findTenantById(id)` - Buscar por ID
- `listTenants(limit, offset)` - Listar todos
- `createTenant(data)` - Criar novo
- `updateTenant(id, data)` - Atualizar

### Plans
- `findPlanById(id)` - Buscar plano
- `listPlans()` - Listar todos
- `createPlan(data)` - Criar novo

### Features
- `findFeatureFlags(planIds)` - Listar features
- `checkFeature(module, planId)` - Verificar acesso
- `createFeatureFlag(data)` - Criar feature

## Usage

```typescript
import { MasterRepository } from '@/src/modules/master'

const masterRepo = new MasterRepository()

// Get tenant
const tenant = await masterRepo.findTenantBySlug('my-company')

// Check feature access
const hasFeature = await masterRepo.checkFeature('rh', tenant.planId)

// List plans
const plans = await masterRepo.listPlans()
```
