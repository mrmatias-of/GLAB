# Multi-Tenant SaaS System - Complete Documentation

## Overview

G-LAB é agora um sistema **Multi-Tenant SaaS** profissional similar ao **Bling**, com:

- ✅ **Database per Tenant** (isolamento máximo)
- ✅ **Customização completa** (logo, cores, layout, tema)
- ✅ **Admin panel** para gerenciar tenants
- ✅ **Branding dinâmico** injetado via React Context
- ✅ **Segurança** com middleware de validação
- ✅ **Pronto para Stripe** (billing integration)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    G-LAB Admin Panel                        │
│              (admin@glabcursos.com.br)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /admin/tenants                                      │  │
│  │  - List all customer workspaces                      │  │
│  │  - Create new tenant                                │  │
│  │  - Update plan (free → pro → enterprise)            │  │
│  │  - Suspend/delete tenant                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
    │ Tenant 1 │      │ Tenant 2 │      │ Tenant N │
    │ (acme)   │      │ (contoso)│      │          │
    └────┬────┘      └────┬────┘      └────┬────┘
         │                │                 │
    ┌────▼──────────┐ ┌───▼──────────┐ ┌──▼──────────┐
    │ /acme/        │ │ /contoso/    │ │ /tenant-n/  │
    │ Dashboard     │ │ Dashboard    │ │ Dashboard   │
    │ Settings      │ │ Settings     │ │ Settings    │
    │ Branding      │ │ Branding     │ │ Branding    │
    └───────────────┘ └──────────────┘ └─────────────┘
         │                │                 │
    ┌────▼──────────┐ ┌───▼──────────┐ ┌──▼──────────┐
    │   DB: Tenant  │ │   DB: Tenant │ │   DB: Tenant│
    │   Isolated    │ │   Isolated   │ │   Isolated  │
    └───────────────┘ └──────────────┘ └─────────────┘
```

---

## Database Schema

### Master Database (Central)

Tables no banco master (onde admin@glabcursos.com.br gerencia tudo):

#### `tenants`
```sql
id              TEXT PRIMARY KEY
slug            TEXT UNIQUE         -- URL identifier (acme, contoso, etc)
name            TEXT                -- "Acme Corporation"
email           TEXT                -- "admin@acme.com"
databaseUrl     TEXT                -- Connection string do tenant
databaseName    TEXT                -- Nome do banco (tenant_acme)
ownerUserId     TEXT FOREIGN KEY    -- Proprietário
plan            VARCHAR(50)         -- free, pro, enterprise
status          VARCHAR(20)         -- active, suspended, deleted
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
deletedAt       TIMESTAMP           -- Soft delete
```

#### `tenantMembers`
```sql
id              TEXT PRIMARY KEY
tenantId        TEXT FOREIGN KEY    -- Link to tenant
userId          TEXT FOREIGN KEY    -- Link to user
role            VARCHAR(20)         -- owner, admin, member
createdAt       TIMESTAMP
```

#### `tenantBranding`
```sql
id              TEXT PRIMARY KEY
tenantId        TEXT UNIQUE FK      -- One branding per tenant
logoUrl         TEXT                -- URL to tenant logo
primaryColor    VARCHAR(7)          -- #3B82F6
secondaryColor  VARCHAR(7)          -- #06B6D4
accentColor     VARCHAR(7)          -- #10B981
backgroundColor VARCHAR(7)          -- #0B0F19
textColor       VARCHAR(7)          -- #F1F5F9
theme           VARCHAR(20)         -- dark, light
favicon         TEXT
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

#### `tenantPlans`
```sql
id              TEXT PRIMARY KEY
name            VARCHAR(100) UNIQUE -- "Professional"
slug            VARCHAR(100) UNIQUE -- "pro"
description     TEXT
price           DECIMAL(10,2)       -- 99.00
billingCycle    VARCHAR(20)         -- monthly, yearly
maxUsers        INTEGER             -- null = unlimited
maxClients      INTEGER
maxServiceOrders INTEGER
features        TEXT                -- JSON array
active          BOOLEAN
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

#### `tenantSubscriptions`
```sql
id                      TEXT PRIMARY KEY
tenantId                TEXT UNIQUE FK
planId                  TEXT FK
stripeSubscriptionId    TEXT            -- Stripe subscription ID
status                  VARCHAR(20)     -- active, canceled, past_due
currentPeriodStart      TIMESTAMP
currentPeriodEnd        TIMESTAMP
createdAt               TIMESTAMP
updatedAt               TIMESTAMP
```

### Tenant Databases (Per-Tenant)

Cada tenant tem seu próprio banco de dados com:
- `usuarios`
- `clientes`
- `tecnicos`
- `ordens_servico`
- `servicos`
- `estoque`
- etc.

---

## URL Structure

### Master Admin Routes
```
/admin/                          - Admin dashboard
/admin/tenants                   - List all tenants
/admin/tenants/new               - Create new tenant
/admin/tenants/[id]              - View/edit tenant details
/admin/tenants/[id]/billing      - Manage billing
/admin/dashboard-intelligence    - Master analytics
```

### Tenant Routes
```
/{tenantSlug}/                   - Tenant dashboard home
/{tenantSlug}/dashboard          - Tenant dashboard (similar to /admin/dashboard-intelligence)
/{tenantSlug}/settings/branding  - Customize colors, logo, theme
/{tenantSlug}/ordens             - Service orders (tenant-specific data)
/{tenantSlug}/clientes           - Clients (tenant-specific data)
/{tenantSlug}/tecnicos           - Technicians (tenant-specific data)
```

### Middleware Routing
```
Pattern: /[a-z0-9-]+/...
When middleware detects this pattern:
  1. Extracts tenant slug from URL
  2. Calls getCurrentTenant(slug)
  3. Validates tenant exists, is active
  4. Injects tenant info into request headers
  5. Provides tenant context to components
```

---

## Using the Tenant System

### 1. Access Current Tenant in Components

```tsx
'use client'

import { useTenant, useTenantBranding } from '@/lib/hooks/use-tenant'

export function MyComponent() {
  const { tenant, isLoading, error } = useTenant()
  const branding = useTenantBranding()

  return (
    <div style={{ backgroundColor: branding.backgroundColor }}>
      <h1 style={{ color: branding.textColor }}>
        Welcome to {tenant?.name}
      </h1>
      <button style={{ backgroundColor: branding.primaryColor }}>
        Click me
      </button>
    </div>
  )
}
```

### 2. Access Tenant in Server Components

```tsx
import { getCurrentTenant } from '@/lib/tenant'

export async function MyServerComponent({
  params,
}: {
  params: { tenantSlug: string }
}) {
  const tenant = await getCurrentTenant(params.tenantSlug)

  return (
    <div>
      <h1>{tenant?.name}</h1>
      <p>Logo: {tenant?.branding.logoUrl}</p>
    </div>
  )
}
```

### 3. Access Tenant in API Routes

```tsx
import { getTenantFromRequest } from '@/lib/middleware/tenant-middleware'

export async function GET(request: NextRequest) {
  const { id, slug, plan } = getTenantFromRequest(request)
  
  // Use tenant info in API logic
  return NextResponse.json({ tenantId: id })
}
```

### 4. Admin Creating a New Tenant

```tsx
import { createTenant } from '@/lib/tenant'

const newTenant = await createTenant({
  slug: 'acme-corp',
  name: 'Acme Corporation',
  email: 'admin@acme.com',
  ownerUserId: 'user_123',
  databaseUrl: process.env.DATABASE_URL,
  databaseName: 'tenant_acme_corp',
  plan: 'pro',
})
```

### 5. Customizing Tenant Branding

```tsx
import { updateTenantBranding } from '@/lib/tenant'

await updateTenantBranding('tenant_123', {
  primaryColor: '#FF6B6B',
  logoUrl: 'https://cdn.example.com/acme-logo.png',
  theme: 'light',
})
```

---

## Admin APIs

### List All Tenants
```bash
GET /api/admin/tenants

Response:
{
  "success": true,
  "tenants": [
    {
      "id": "tenant_1",
      "slug": "acme",
      "name": "Acme Corporation",
      "plan": "pro",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Create New Tenant
```bash
POST /api/admin/tenants

Body:
{
  "name": "Acme Corporation",
  "email": "admin@acme.com",
  "slug": "acme",
  "plan": "free"
}

Response:
{
  "success": true,
  "tenant": {
    "id": "tenant_123",
    "slug": "acme",
    "name": "Acme Corporation",
    "status": "active"
  }
}
```

### Update Tenant Plan
```bash
PUT /api/admin/tenants/[tenantId]

Body:
{
  "plan": "pro"
}

Response:
{
  "success": true,
  "tenant": { ... }
}
```

### Update Tenant Branding
```bash
PUT /api/tenant/[tenantSlug]/branding

Body:
{
  "primaryColor": "#3B82F6",
  "secondaryColor": "#06B6D4",
  "accentColor": "#10B981",
  "backgroundColor": "#0B0F19",
  "textColor": "#F1F5F9",
  "theme": "dark",
  "logoUrl": "https://cdn.example.com/logo.png"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

### Delete Tenant
```bash
DELETE /api/admin/tenants/[tenantId]

Response:
{
  "success": true,
  "message": "Tenant deleted"
}
```

---

## React Context & Hooks

### TenantProvider
Wrapper necessário para acessar tenant data em components:

```tsx
// Em [tenantSlug]/layout.tsx
import { TenantProvider } from '@/lib/hooks/use-tenant'

export default async function TenantLayout({ children, params }) {
  const tenant = await getCurrentTenant(params.tenantSlug)

  return (
    <TenantProvider tenant={tenant}>
      {children}
    </TenantProvider>
  )
}
```

### useTenant()
Access tenant info in client components:

```tsx
const { tenant, isLoading, error } = useTenant()
// tenant.name, tenant.id, tenant.plan, tenant.status
```

### useTenantBranding()
Get tenant colors and branding:

```tsx
const branding = useTenantBranding()
// branding.primaryColor, logoUrl, theme, etc
```

### useTenantTheme()
Get CSS variables for styling:

```tsx
const theme = useTenantTheme()
// { '--tenant-primary': '#3B82F6', ... }
```

---

## Middleware Configuration

Tenant validation happens in `middleware.ts`:

```typescript
export const config = {
  matcher: [
    '/admin/:path*',      // Admin routes
    '/:tenant/:path*',    // Tenant routes
  ],
}
```

When middleware detects `/{tenantSlug}/...`:
1. Extracts `tenantSlug` from URL
2. Calls `getCurrentTenant(tenantSlug)`
3. Validates tenant exists and is active
4. Sets request headers: `x-tenant-id`, `x-tenant-slug`, `x-tenant-plan`
5. Allows request to proceed or blocks if tenant invalid

---

## Security Considerations

### Tenant Isolation

✅ **URL-based routing**: Tenants access via `/acme/...`, `/contoso/...`

✅ **Middleware validation**: Invalid tenants blocked at middleware level

✅ **Database isolation**: Each tenant has separate PostgreSQL database

✅ **Context injection**: Tenant info provided via React Context (no leaking between tenants)

✅ **API scoping**: Admin APIs check authentication and authorization

### Admin Protection

✅ **Admin routes**: `/admin/*` requires authentication

✅ **Tenant admin**: Each tenant has `tenantMembers` with roles (owner, admin, member)

✅ **Plan enforcement**: Features locked behind plan tier

### Soft Deletes

✅ **Non-destructive**: Tenants marked as deleted, not removed

✅ **Data preservation**: Can recover if needed

✅ **Audit trail**: `deletedAt` timestamp recorded

---

## Next Steps for Monetization

### 1. Multi-Database Routing (Ready)
```typescript
// Route queries to tenant-specific database
const dbForTenant = getConnection(tenantId)
await dbForTenant.select().from(orders)
```

### 2. Stripe Integration (Setup Next)
```typescript
// Create subscription
const subscription = await stripe.subscriptions.create({
  customer: stripeCustomerId,
  items: [{ price: 'price_pro_monthly' }],
})

// Save in tenantSubscriptions table
```

### 3. Usage Tracking
```typescript
// Track usage per tenant
trackUsage(tenantId, 'service_order_created')
trackUsage(tenantId, 'api_call')

// Check against plan limits
if (usage > plan.maxServiceOrders) {
  // Show upgrade prompt
}
```

### 4. Signup/Onboarding
```
1. User lands on /signup
2. Choose plan (free/pro/enterprise)
3. Create tenant account
4. Verify email
5. Setup branding
6. Invited to /{tenantSlug}/
```

---

## File Structure

```
app/
├── admin/
│   ├── tenants/
│   │   ├── page.tsx              # List tenants
│   │   ├── new/page.tsx          # Create tenant form
│   │   ├── [id]/page.tsx         # View tenant details
│   │   └── [id]/edit/page.tsx    # Edit tenant (planned)
│   └── dashboard-intelligence/   # Master analytics
│
├── [tenantSlug]/
│   ├── layout.tsx                # Tenant layout + context
│   ├── page.tsx                  # Tenant home
│   ├── settings/
│   │   └── branding/
│   │       └── page.tsx          # Branding customization
│   ├── ordens/
│   ├── clientes/
│   └── tecnicos/
│
├── api/
│   ├── admin/
│   │   └── tenants/
│   │       ├── route.ts          # GET, POST tenants
│   │       └── [tenantId]/route.ts # GET, PUT, DELETE
│   └── tenant/
│       └── [tenantSlug]/
│           └── branding/
│               └── route.ts      # PUT branding

lib/
├── tenant.ts                     # Tenant utilities
├── hooks/
│   └── use-tenant.tsx            # React hooks
└── middleware/
    └── tenant-middleware.ts      # Validation middleware
```

---

## Example: Creating Your First Tenant

### Via Admin Panel

1. Go to `/admin/tenants`
2. Click "New Tenant"
3. Fill in:
   - Name: "Acme Corporation"
   - Email: "admin@acme.com"
   - Slug: "acme" (auto-generated)
   - Plan: "pro"
4. Click "Create Tenant"
5. Tenant created! Access at: `https://glabcursos.com.br/acme/`

### Via API

```bash
curl -X POST http://localhost:3000/api/admin/tenants \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_session=..." \
  -d '{
    "name": "Acme Corporation",
    "email": "admin@acme.com",
    "slug": "acme",
    "plan": "pro"
  }'
```

### Via Code

```typescript
import { createTenant } from '@/lib/tenant'

const tenant = await createTenant({
  slug: 'acme',
  name: 'Acme Corporation',
  email: 'admin@acme.com',
  ownerUserId: 'user_123',
  databaseUrl: process.env.DATABASE_URL,
  databaseName: 'tenant_acme',
  plan: 'pro',
})

console.log(`Tenant created: /acme/`)
```

---

## Troubleshooting

### Tenant Not Found Error
- Check slug is correct
- Verify tenant exists in master database
- Check tenant status is not "suspended" or "deleted"

### Branding Not Applying
- Ensure TenantProvider wraps component tree
- Check useTenantBranding() is called from client component ('use client')
- Verify colors are valid hex (#RRGGBB)

### API Errors
- Check authentication (auth_session cookie)
- Verify admin user has permission
- Check request body has required fields

---

## Status

✅ **MVP Complete**
- Database schema
- Tenant management
- Customization system
- Admin panel
- API routes

🔄 **In Progress / Planned**
- Multi-database routing (Neon)
- Stripe billing
- Signup/onboarding flow
- Team management
- Usage analytics
- Audit logs

---

**Built with:** Next.js 16, React 19, Drizzle ORM, Better Auth, Tailwind CSS
