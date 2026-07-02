# Phase 2: Middleware Integration - Status & Implementation Guide

## Current Status

**Completed**: 2/53 routes (4%)
**In Progress**: Scripts & templates ready
**Remaining**: 51/53 routes (96%)

### Completed Routes
- ✓ app/api/clientes/route.ts (GET, POST)
- ✓ app/api/clientes/[id]/route.ts (GET, PUT, DELETE)

## Architecture Pattern Established

All migrated routes now follow this pattern:

```typescript
import { auth } from '@/lib/auth'
import { createApiSuccess, createApiError } from '@/lib/middleware/api-response'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { validateBody } from '@/lib/validators/schema-validator'

async function getRequestContext() {
  // Auth + tenant extraction
}

export async function GET(req) {
  // Rate limit check
  // Auth + context
  // Service call
  // Response
}

export async function POST(req) {
  // Rate limit check
  // Auth + context
  // CSRF check
  // Validation
  // Service call
  // Response
}
```

## Integration Checklist

### By Module

- [ ] **clientes** (2/2 - DONE)
  - [x] app/api/clientes/route.ts
  - [x] app/api/clientes/[id]/route.ts

- [ ] **estoque** (0/3)
  - [ ] app/api/estoque/route.ts
  - [ ] app/api/estoque/[id]/route.ts
  - [ ] app/api/estoque/baixa/route.ts

- [ ] **ordens-servico** (0/2)
  - [ ] app/api/ordens-servico/route.ts
  - [ ] app/api/ordens-servico/[id]/route.ts

- [ ] **financeiro** (0/7)
  - [ ] app/api/financeiro/route.ts
  - [ ] app/api/financeiro/notas-fiscais/route.ts
  - [ ] app/api/financeiro/pagamentos/route.ts
  - [ ] app/api/financeiro/cobranças/route.ts
  - [ ] app/api/financeiro/assinatura/route.ts
  - [ ] app/api/financeiro/relatórios/route.ts
  - [ ] app/api/financeiro/fatura/[id]/route.ts

- [ ] **rh** (0/8)
  - [ ] app/api/rh/funcionarios/route.ts
  - [ ] app/api/rh/funcionarios/[id]/route.ts
  - [ ] app/api/rh/banco-horas/route.ts
  - [ ] app/api/rh/config-impostos/route.ts
  - [ ] app/api/rh/contracheques/route.ts
  - [ ] app/api/rh/eventos-folha/route.ts
  - [ ] app/api/rh/gerar-folha-pagamento/route.ts
  - [ ] app/api/rh/relatórios/route.ts

- [ ] **auth** (0/5)
  - [ ] app/api/auth/signin/route.ts
  - [ ] app/api/auth/signup/route.ts
  - [ ] app/api/auth/logout/route.ts
  - [ ] app/api/auth/reset-password/route.ts
  - [ ] app/api/auth/confirm-reset-password/route.ts

- [ ] **dashboard** (0/6)
  - [ ] app/api/dashboard/stats/route.ts
  - [ ] app/api/dashboard/recent-activity/route.ts
  - [ ] app/api/dashboard/tasks/route.ts
  - [ ] app/api/dashboard/performance/route.ts
  - [ ] app/api/dashboard/alerts/route.ts
  - [ ] app/api/dashboard/reports/route.ts

- [ ] **ordens** (0/2)
  - [ ] app/api/ordens/route.ts
  - [ ] app/api/ordens/[id]/route.ts

- [ ] **comissoes** (0/2)
  - [ ] app/api/comissoes/route.ts
  - [ ] app/api/comissoes/registrar/route.ts

- [ ] **servicos** (0/2)
  - [ ] app/api/servicos/route.ts
  - [ ] app/api/servicos/[id]/route.ts

- [ ] **tecnicos** (0/2)
  - [ ] app/api/tecnicos/route.ts
  - [ ] app/api/tecnicos/[id]/route.ts

- [ ] **Other** (0/11)
  - [ ] app/api/master/feature-flags/route.ts
  - [ ] app/api/notificacoes/route.ts
  - [ ] app/api/contact/route.ts
  - [ ] app/api/relatorios/route.ts
  - [ ] app/api/track/route.ts
  - [ ] app/api/upload/route.ts
  - [ ] app/api/geolocation/route.ts
  - [ ] app/api/validate-equipment/route.ts
  - [ ] app/api/roteamento/route.ts
  - [ ] app/api/ocr/route.ts
  - [ ] app/api/comissoes/activity/route.ts

## Quick Migration Guide

### Step 1: Use the Generator

```bash
node scripts/generate-migrated-routes.js app/api/MODULE/route.ts --write
```

This creates a skeleton with:
- Auth context extraction
- Rate limiting
- CSRF validation
- Zod validation setup
- Error handling

### Step 2: Implement Service Logic

Replace TODO placeholders with actual service calls:

```typescript
export async function GET(req) {
  // ... boilerplate ...
  
  // TODO: Replace with actual logic
  const items = await estoqueService.listar(ctx.userId, ctx.tenantId)
  return createApiSuccess(items, 'Items retrieved')
}
```

### Step 3: Add Validation Schemas

Ensure `src/modules/MODULE/schemas/index.ts` has:
- `CreateXSchema`
- `UpdateXSchema`
- `QueryXSchema` (optional for GET filters)

### Step 4: Test the Route

Test locally with:
```bash
curl -H "x-csrf-token: test" \
     -H "Authorization: Bearer ..." \
     http://localhost:3000/api/module/
```

## Tools Available

### 1. **Automated Generator**
```bash
node scripts/generate-migrated-routes.js app/api/MODULE/route.ts --write
```

### 2. **Migration Report**
```bash
node scripts/migrate-routes-phase2.js
```
Shows current status and remaining work.

### 3. **Template Files**
- `ROUTE_TEMPLATE.md` - Manual template examples
- `app/api/estoque/_migration-template.ts` - Estoque example

## Integration Features

Each migrated route now includes:

### ✓ Authentication
- Session validation
- Tenant context extraction
- User ID propagation

### ✓ Rate Limiting
- Global: 1000 req/min
- Per-user: 100 req/min
- Create: 20 req/min
- Login: 10/15min

### ✓ CSRF Protection
- Token validation on POST/PUT/DELETE
- Secure cookie pattern

### ✓ Input Validation
- Zod schema validation
- Detailed error messages
- Type safety

### ✓ Error Handling
- Consistent error format
- Proper HTTP status codes
- Logging for debugging

### ✓ Multi-Tenant Support
- Automatic tenant context
- Data isolation enforced
- Tenant in all service calls

## Next Steps

### Phase 2A: Core Routes (Week 1)
Migrate high-priority routes using generator:
1. Estoque (3 routes)
2. Ordens-servico (2 routes)
3. RH (8 routes)
4. Financeiro (7 routes)

**Est. time**: 1-2 days with generator

### Phase 2B: Remaining Routes (Week 1-2)
Batch migrate remaining 33 routes using generator.
Focus on testing + validation.

### Phase 2C: Testing & Deployment (Week 2-3)
- Unit tests for validators
- Integration tests for middleware
- E2E tests for auth flows
- Staging deployment

## Performance Notes

- **Generator approach**: ~5 min to generate all 51 remaining routes
- **Manual implementation**: 30-60 min per route
- **Testing per route**: 15-30 min

**Recommended approach**: Use generator + bulk edit for similar routes.

## Deployment Readiness

Routes are ready for deployment once:
- [ ] Middleware integrated
- [ ] Validation schemas created
- [ ] Service logic implemented
- [ ] Tests passing (70%+ coverage)
- [ ] Staging validation passed
- [ ] Team review approved

## Known Issues & Workarounds

### Issue 1: Dynamic Route Params
Dynamic routes like `[id]/route.ts` need params extraction:
```typescript
export async function GET(req, { params }) {
  const { id } = await params
  // Use id in service calls
}
```

### Issue 2: File Uploads
Routes handling file uploads need multipart handling:
```typescript
const formData = await req.formData()
const file = formData.get('file')
```

### Issue 3: Streaming Responses
For large downloads, use streaming:
```typescript
const stream = fs.createReadStream(file)
return new NextResponse(stream)
```

## Success Metrics

- ✓ 100% of routes have middleware
- ✓ 100% of routes have validation
- ✓ 100% of routes have auth checks
- ✓ 100% support multi-tenant isolation
- ✓ 70%+ test coverage
- ✓ Zero security violations in testing
- ✓ Rate limiting verified
- ✓ CSRF protection verified

## Timeline

| Phase | Tasks | Timeline |
|-------|-------|----------|
| 2A | Core routes + generator | 1-2 days |
| 2B | Remaining routes | 2-3 days |
| 2C | Testing + validation | 3-4 days |
| 2D | Staging + fixes | 2-3 days |
| **Total** | **All tasks** | **~1-2 weeks** |

---

**Status**: In Progress - Middleware integration framework complete, now scaling to all routes.

**Last Updated**: [DATE]

**Next Review**: After completing first 5 routes with generator.
