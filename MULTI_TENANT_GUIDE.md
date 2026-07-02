# Multi-Tenant Implementation Guide

## Overview

GLAB ERP 3.0 implements strict multi-tenant data isolation to prevent cross-company data leakage.

## Architecture

### 1. Tenant Discovery
The middleware automatically discovers tenant from multiple sources:
- `x-tenant-id` header (highest priority)
- `x-tenant-slug` header
- Subdomain (e.g., company.glab.com)
- Query parameter `?tenant=slug`

### 2. Row-Level Security (RLS)

Every query includes `tenantId` filter:

```typescript
// Good - tenant-scoped query
const cliente = await db.query.clientes.findFirst({
  where: and(
    eq(clientes.id, id),
    eq(clientes.tenantId, tenantId)  // ✓ REQUIRED
  ),
})

// Bad - missing tenant filter
const cliente = await db.query.clientes.findFirst({
  where: eq(clientes.id, id)  // ✗ SECURITY RISK
})
```

### 3. Access Enforcement

Use `withTenantFilter` for critical operations:

```typescript
import { withTenantFilter } from '@/src/modules/shared/utils/tenant-filter'

// In API route
const cliente = await withTenantFilter(
  userId,
  tenantId,
  'clientes',
  async () => {
    return await clienteRepository.findById(clienteId, tenantId)
  }
)
```

### 4. Service Integration

MultiTenantService automatically validates access:

```typescript
import { multiTenantService } from '@/src/modules/shared/services/multi-tenant.service'

// At start of service method
await multiTenantService.enforceTenantAccess(userId, tenantId, 'clientes')

// Now safe to access data
const clientes = await repository.findAll(tenantId)
```

## Security Checklist

Before deploying, verify:

- [ ] Every table query includes `tenantId` WHERE clause
- [ ] Service methods call `enforceTenantAccess()` first
- [ ] Middleware validates `x-tenant-id` header
- [ ] No raw SQL queries (use Drizzle ORM always)
- [ ] API routes verify tenant from request context
- [ ] Audit logs show tenant access

## Common Mistakes

### ❌ Direct table access
```typescript
// BAD - no tenant filter
const todos = await db.query.todos.findMany()
```

### ❌ Relying only on frontend
```typescript
// BAD - trusting client-side tenant
const tenantId = req.query.tenantId  // User can forge this!
```

### ✅ Correct approach
```typescript
// GOOD - validate tenant access first
const tenantId = request.headers.get('x-tenant-id')
await multiTenantService.enforceTenantAccess(userId, tenantId, 'todos')
const todos = await db.query.todos.findMany({
  where: eq(todos.tenantId, tenantId)
})
```

## Testing Multi-Tenant

```bash
# Test tenant isolation
curl -H "x-tenant-id: company-a" http://localhost:3000/api/clientes
curl -H "x-tenant-id: company-b" http://localhost:3000/api/clientes
# Should return different data
```

## Database Indexes

For performance, ensure indexes on tenantId:

```sql
CREATE INDEX idx_clientes_tenant ON clientes(tenantId);
CREATE INDEX idx_clientes_tenant_id ON clientes(tenantId, id);
```

## Audit Logging

All tenant access is logged:

```typescript
logTenantAccess(userId, tenantId, 'CREATE', 'clientes')
// [TenantAudit] CREATE - clientes
// userId: user_123
// tenantId: company_abc
// timestamp: 2024-07-02T10:30:00Z
```

## Emergency: Data Breach Response

If data isolation is breached:

1. Stop the application
2. Check middleware logs for which tenant accessed what
3. Review audit logs in `logTenantAccess` calls
4. Notify affected tenants

## References

- `src/modules/shared/services/multi-tenant.service.ts` - Service
- `src/modules/shared/repositories/multi-tenant.repository.ts` - Repository
- `src/modules/shared/utils/tenant-filter.ts` - Utilities
- `middleware.ts` - Tenant discovery & validation
