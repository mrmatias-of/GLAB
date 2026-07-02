# Security Guide - GLAB ERP 3.0

## Overview

Phase 1 Critical implements core security measures to protect against common web attacks.

## 1. CSRF (Cross-Site Request Forgery) Protection

### How It Works

1. Server generates token and sets in cookie
2. Client reads token from cookie
3. Client sends token in `x-csrf-token` header
4. Server validates header token matches cookie token
5. Token refreshed on each page load

### Implementation

```typescript
import { setCSRFCookie, verifyCSRFToken } from '@/lib/security/csrf-protection'

// In middleware or GET endpoint to return CSRF token
const response = new NextResponse()
setCSRFCookie(response) // Sets X-CSRF-Token header
return response

// In API route handler for state-changing requests
const csrfValidation = verifyCSRFToken(request)
if (!csrfValidation.valid) {
  return errorResponse(csrfValidation.error, 403)
}
```

### Frontend Usage

```javascript
// Get CSRF token
const csrfToken = document.querySelector('meta[name="csrf"]')?.content

// Or from response header
const csrfToken = response.headers.get('X-CSRF-Token')

// Send in subsequent requests
fetch('/api/clientes', {
  method: 'POST',
  headers: {
    'x-csrf-token': csrfToken,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
```

### CSRF Bypass for Development

```bash
# Enable in .env.development.local
CSRF_BYPASS_DEV=true
```

## 2. Rate Limiting

### Strategies

**Global Rate Limit**
- 1000 requests per minute (all users)
- Prevents DDoS attacks

**Per-User Rate Limit**
- 100 requests per minute per user
- Prevents individual user abuse

**Per-IP Rate Limit**
- 50 requests per minute per IP
- Prevents bot attacks

**Endpoint-Specific Rate Limit**
- Login: 10 attempts per 15 minutes
- Create: 20 per minute
- Prevents brute force

### Implementation

```typescript
import { 
  checkRateLimit, 
  RATE_LIMIT_DEFAULTS,
  keyGenerators 
} from '@/lib/security/rate-limit'

// In middleware or API route
const { allowed, remaining, resetAt } = checkRateLimit(
  keyGenerators.perUser(request),
  RATE_LIMIT_DEFAULTS.PER_USER
)

if (!allowed) {
  return new NextResponse(
    JSON.stringify({
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
    }),
    { status: 429 }
  )
}
```

### Response Headers

Every response includes rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1625097600
```

### Monitoring

```typescript
import { getRateLimitStats } from '@/lib/security/rate-limit'

// View current rate limit stats
const stats = getRateLimitStats()
console.log(stats)
// { totalKeys: 150, entries: [...] }
```

## 3. Authentication & Authorization

### Session Management

```typescript
// Get session with tenant
const session = await getSessionWithTenant(request)

if (!session) {
  return unauthorizedResponse()
}

// Session includes: user, tenantId, token
```

### Authorization

```typescript
// Check user-tenant access
const access = await multiTenantService.enforceTenantAccess(
  userId,
  tenantId,
  'clientes'
)

if (!access) {
  return forbiddenResponse()
}
```

## 4. Input Validation

All API inputs validated with Zod:

```typescript
import { validateBody } from '@/lib/validators/schema-validator'
import { CreateClienteSchema } from '@/src/modules/clientes/schemas'

const validation = await validateBody(req, CreateClienteSchema)
if (!validation.success) {
  return validation.response // 400 with details
}

// Data is now type-safe
const cliente = validation.data
```

## 5. Middleware Security Stack

```
1. CSRF validation (POST/PUT/DELETE/PATCH)
2. Rate limiting (per-user, per-endpoint)
3. Authentication (session check)
4. Authorization (tenant access)
5. Input validation (schema verification)
6. Audit logging (all operations)
```

## 6. Audit Logging

All tenant operations logged:

```typescript
logTenantAccess(userId, tenantId, 'CREATE', 'clientes')
// [TenantAudit] CREATE - clientes
// userId: user_123, tenantId: tenant_abc
// timestamp: 2024-07-02T10:30:00Z
```

## 7. Environment Security

Set in `.env.production`:

```bash
# Enable secure CSRF (HTTPS only)
NODE_ENV=production

# Session expiration (7 days default)
SESSION_EXPIRES_IN=604800

# Rate limiting (per minute)
RATE_LIMIT_GLOBAL=1000
RATE_LIMIT_PER_USER=100
RATE_LIMIT_LOGIN=10
```

## 8. Common Security Issues

### ❌ Missing CSRF Token
```typescript
// BAD
fetch('/api/clientes', {
  method: 'POST',
  body: JSON.stringify(data),
})

// GOOD
fetch('/api/clientes', {
  method: 'POST',
  headers: { 'x-csrf-token': csrfToken },
  body: JSON.stringify(data),
})
```

### ❌ No Tenant Validation
```typescript
// BAD
const clientes = await db.query.clientes.findMany()

// GOOD
const clientes = await db.query.clientes.findMany({
  where: eq(clientes.tenantId, tenantId)
})
```

### ❌ No Input Validation
```typescript
// BAD
const cliente = await service.criar(userData)

// GOOD
const validation = await validateBody(req, CreateClienteSchema)
const cliente = await service.criar(validation.data)
```

## 9. Production Checklist

- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Middleware running on all protected routes
- [ ] Multi-tenant isolation enforced
- [ ] Zod validation on all API routes
- [ ] Audit logging enabled
- [ ] HTTPS only in production
- [ ] Session expiration set
- [ ] Security headers added
- [ ] CORS configured properly
- [ ] SQL injection prevention (using Drizzle ORM)
- [ ] XSS prevention (Next.js default)

## 10. Incident Response

### Data Breach
1. Stop application
2. Check middleware logs for unauthorized access
3. Review audit logs
4. Notify affected tenants
5. Implement additional monitoring

### DDoS Attack
1. Check rate limiting stats
2. Increase IP-based rate limits
3. Enable DDoS protection (Cloudflare)
4. Block malicious IPs

### Brute Force Attack
1. Check failed login attempts in audit logs
2. Implement account lockout (after N attempts)
3. Add email verification
4. Enable 2FA

## References

- `lib/security/csrf-protection.ts` - CSRF
- `lib/security/rate-limit.ts` - Rate limiting
- `middleware.ts` - Security middleware stack
- `MULTI_TENANT_GUIDE.md` - Multi-tenant security
- `ZOD_VALIDATION_GUIDE.md` - Input validation
