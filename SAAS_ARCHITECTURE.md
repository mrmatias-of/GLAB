# GLAB ERP - Arquitetura SaaS Multi-Tenant

## Visão Geral

GLAB ERP foi refatorado para uma arquitetura **database-per-tenant** SaaS profissional, preparada para escalar a milhares de clientes.

**Componentes principais:**
- Master Layer (gestão centralizada de tenants, planos, features)
- Tenant Layer (dados isolados por cliente)
- Tenant Detection Middleware (subdomain/path/header)
- Feature Flags (módulos por plano)
- Audit & Security (isolamento completo)

---

## 1. MASTER LAYER - Gestão Centralizada

### Database Schema (15 tabelas)

**Tenants & Companies**
```sql
tenants - Empresas cadastradas
  - id, slug, name, owner_id
  - database_url, schema_name (para tenant DB)
  - status (active, trial, suspended)
  - trial_expires_at, created_at

tenant_members - Usuários de cada tenant
  - tenant_id, user_id, role
  - owner, admin, member
```

**Plans & Pricing**
```sql
plans - Planos de preço
  - slug, name, price_monthly, price_yearly
  - max_users, max_storage_gb
  - features (JSON array)
  - trial_days, is_active

subscriptions - Assinaturas ativas
  - tenant_id, plan_id
  - status (trial, active, cancelled, expired)
  - current_period_start/end
  - auto_renew

invoices - Faturamento
  - subscription_id, amount, currency
  - status (draft, issued, paid, failed)
  - issue_date, due_date, paid_date
```

**Feature Flags**
```sql
feature_flags - Módulos do sistema
  - key ('rh_module', 'crm_module', etc)
  - name, description
  - is_global, is_active

plan_features - Features por plano
  - plan_id, feature_id (junction table)

tenant_features - Overrides por tenant
  - tenant_id, feature_id, is_enabled
  - Para customizações especiais
```

**Segurança & Auditoria**
```sql
master_user - Admins da plataforma
  - id, email, role (admin, manager)
  - status, emailVerified

master_session - Sessões master

audit_log - Log de todas ações
  - tenant_id, user_id, action
  - entity_type, entity_id, changes (JSON)
  - ip_address, user_agent

api_keys - Autenticação de integrações
  - tenant_id, key_hash, is_active

webhooks - Eventos assíncronos
  - tenant_id, event_type, url, secret
```

### Master Admin Pages

**URL:** `https://app.com/master/*`

- `/master` - Dashboard (stats, 6 seções de gestão)
- `/master/tenants` - CRUD de empresas
- `/master/plans` - Gerenciar planos
- `/master/features` - Feature flags
- `/master/subscriptions` - Subscrições
- `/master/users` - Admins e suporte
- `/master/analytics` - Métricas (MRR, churn, etc)

---

## 2. TENANT LAYER - Isolamento de Dados

### Como Funciona

Cada tenant tem seu próprio PostgreSQL database/schema com:
- Todas as tabelas de aplicação (clientes, estoque, ordens, RH, etc)
- Column `tenantId` em cada tabela para duplo isolamento
- Connection string secura no Master DB

### Refactoring de Tabelas

**Antes (Single Tenant):**
```typescript
export const clientes = pgTable('clientes', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  email: text('email'),
})
```

**Depois (Multi Tenant):**
```typescript
export const clientes = pgTable('clientes', {
  id: serial('id').primaryKey(),
  tenantId: text('tenantId').notNull(),  // ← Adicionar isto
  nome: text('nome').notNull(),
  email: text('email'),
})
// CREATE UNIQUE INDEX idx_clientes_email_per_tenant ON clientes(tenantId, email)
```

### Padrão de Queries Seguras

**NUNCA faça:**
```typescript
// ✗ ERRADO - poderia retornar dados de outro tenant
const clientes = await db.select().from(clientes)
```

**SEMPRE use tenantId:**
```typescript
// ✓ CORRETO
import { getCurrentTenantId, withTenantFilter } from '@/lib/db/tenant-queries'

const tenantFilter = await buildTenantFilter(clientes.tenantId)
const meus_clientes = await db.select()
  .from(clientes)
  .where(tenantFilter)
```

### Helpers para Queries

```typescript
// Get current tenant ID (from middleware/headers/cookies)
const tenantId = await getCurrentTenantId()

// Build safe WHERE clause
const filter = await buildTenantFilter(tabela.tenantId)
const resultado = await db.select().from(tabela).where(filter)

// Wrap condition with tenant filtering
const customFilter = await withTenantFilter(
  eq(clientes.id, 123),
  clientes.tenantId
)

// Add tenantId automatically to data
const data = await withTenantData({ nome: 'João' })
// Returns: { nome: 'João', tenantId: '...' }

// Assert ownership (prevent cross-tenant access)
await assertTenantOwnership(clienteData)
```

---

## 3. TENANT DETECTION - Como Funciona

### 3 Formas de Identificar Tenant

**1. Subdomain (Recomendado)**
```
https://empresa-xyz.app.com
https://minha-empresa.localhost:3000
→ Detecta: empresa-xyz
```

**2. Path**
```
https://app.com/tenant/empresa-xyz
https://app.com/t/empresa-xyz
→ Detecta: empresa-xyz
```

**3. Header**
```
X-Tenant-Slug: empresa-xyz
X-Tenant-ID: 123e4567-e89b-12d3-a456
→ Detecta: tenant ID
```

### Middleware Proxy (proxy.ts)

Roda em **toda requisição** para:
1. Detectar tenant
2. Validar sessão do usuário
3. Verificar acesso ao tenant
4. Injetar tenantId nos headers

```typescript
// Exemplo de requisição com middleware
GET /admin/clientes
Headers: X-Tenant-ID: 123, X-Tenant-Slug: empresa-xyz
↓
proxy.ts (middleware)
↓
Validação ✓
↓
Página/API com tenantId disponível
```

---

## 4. FEATURE FLAGS - Controle de Módulos

### Como Usar no Frontend

```typescript
'use client'

import { useFeatureFlag, FeatureGuard } from '@/lib/hooks/useFeatureFlag'

export function Dashboard() {
  const { enabled: hasRH } = useFeatureFlag('rh_module')
  const { enabled: hasCRM } = useFeatureFlag('crm_module')

  if (!hasRH) return <p>Módulo RH não disponível no seu plano</p>

  return (
    <div>
      <RhDashboard />
      
      <FeatureGuard feature="crm_module" fallback={<p>Upgrade para usar CRM</p>}>
        <CrmModule />
      </FeatureGuard>
    </div>
  )
}
```

### Como Usar na API

```typescript
// app/api/rh/funcionarios/route.ts
import { getCurrentTenantId, buildTenantFilter } from '@/lib/db/tenant-queries'

export async function GET(request: NextRequest) {
  const tenantId = await getCurrentTenantId()
  
  // Check feature
  const response = await fetch('/api/tenant/features/check', {
    method: 'POST',
    body: JSON.stringify({ feature_key: 'rh_module' })
  })
  const { enabled } = await response.json()
  
  if (!enabled) {
    return NextResponse.json(
      { error: 'RH module not available' },
      { status: 403 }
    )
  }

  // Safe query with tenant filtering
  const funcionarios = await db.select()
    .from(funcionarios_table)
    .where(await buildTenantFilter(funcionarios_table.tenantId))

  return NextResponse.json(funcionarios)
}
```

### Estrutura de Features

```typescript
// Feature está em um plano
tenants.subscription.plan → plan_features → feature_flags

// Ou tenant customizado
tenant_features (override)

// Resultado
enabled = (em_plano && is_active) OU tenant_override
```

---

## 5. SEGURANÇA & ISOLAMENTO

### Validações em Cascata

1. **Middleware** - Valida tenant no acesso (proxy.ts)
2. **Session** - Verifica usuário autenticado
3. **Tenant Access** - Checa se usuário é membro do tenant
4. **Data Level** - Todos os WHERE com tenantId
5. **Ownership** - assertTenantOwnership() antes de delete/update

### Exemplo Completo de Segurança

```typescript
// app/api/rh/funcionarios/[id]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Middleware já validou tenant
    const tenantId = await getCurrentTenantId()

    // 2. Buscar dados com filtragem de tenant
    const funcionario = await db.query.funcionarios.findFirst({
      where: await withTenantFilter(
        eq(funcionarios.id, parseInt(params.id)),
        funcionarios.tenantId
      )
    })

    if (!funcionario) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // 3. Assert ownership (extra validation)
    await assertTenantOwnership(funcionario)

    // 4. Delete com tenantId (double-check)
    await db.delete(funcionarios)
      .where(and(
        eq(funcionarios.id, parseInt(params.id)),
        eq(funcionarios.tenantId, tenantId)
      ))

    // 5. Log audit
    await db.insert(audit_log).values({
      tenant_id: tenantId,
      action: 'delete',
      entity_type: 'funcionario',
      entity_id: params.id,
      changes: JSON.stringify({ funcionario })
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## 6. COMO COMEÇAR - Próximos Passos

### Implementar Novo Módulo

```typescript
// 1. Add tenantId ao schema
export const novo_modulo = pgTable('novo_modulo', {
  id: serial('id').primaryKey(),
  tenantId: text('tenantId').notNull(),  // ← Obrigatório
  // ... outros campos
})

// 2. Criar APIs com tenant filtering
// app/api/novo-modulo/route.ts
export async function GET() {
  const tenantFilter = await buildTenantFilter(novo_modulo.tenantId)
  const dados = await db.select().from(novo_modulo).where(tenantFilter)
  return NextResponse.json(dados)
}

// 3. Criar páginas admin
// app/admin/novo-modulo/page.tsx
// Usa currentTenantId() + tenantFilter

// 4. Adicionar feature flag se necessário
// Master DB → plan_features
```

### Adicionar Novo Plano

```typescript
// Master endpoint
POST /api/master/plans
{
  "slug": "professional",
  "name": "Professional",
  "price_monthly": 299,
  "features": ["rh_module", "crm_module", "estoque"]
}
```

### Customizar Feature para Tenant

```typescript
// Override feature (tenant específico paga mais)
POST /api/master/tenants/{id}/features
{
  "feature_key": "crm_module",
  "is_enabled": true
}
```

---

## 7. DEPLOY & PRODUCÇÃO

### Environment Variables

```bash
# Master DB (centralizado)
DATABASE_URL=postgresql://user:pass@host/master_db

# Tenant DB (padrão, pode variar per tenant)
TENANT_DATABASE_URL=postgresql://user:pass@host/tenant_db

# Auth
BETTER_AUTH_SECRET=seu-secret-aleatorio
BETTER_AUTH_URL=https://seu-dominio.com

# Email (Locaweb)
LOCAWEB_EMAIL=seu-email@locaweb.com
LOCAWEB_PASSWORD=sua-senha

# App
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
NODE_ENV=production
```

### Vercel Deployment

```bash
git push origin main
# Vercel detecta e faz deploy automaticamente
# Middleware ativo em todas requisições
```

### Subdomains no DNS

```
*.seu-dominio.com → seu-app.vercel.app
api.seu-dominio.com → seu-app.vercel.app
admin.seu-dominio.com → seu-app.vercel.app
```

---

## 8. MONITORAMENTO & MÉTRICAS

### Usar Audit Log para Analytics

```typescript
// Contar ações por tenant
const acoes = await db.select()
  .from(audit_log)
  .where(eq(audit_log.tenant_id, tenantId))
  .groupBy(audit_log.action)

// Alertar sobre suspeitas (múltiplas deletes)
const deletes = await db.select()
  .from(audit_log)
  .where(and(
    eq(audit_log.tenant_id, tenantId),
    eq(audit_log.action, 'delete'),
    gte(audit_log.created_at, subDays(now(), 1))
  ))

if (deletes.length > 100) {
  // Alert: suspicious activity
}
```

### Métricas Master

```typescript
// MRR (Monthly Recurring Revenue)
const mrr = await db.select({
  total: sum(plans.price_monthly)
})
  .from(subscriptions)
  .innerJoin(plans, eq(subscriptions.plan_id, plans.id))
  .where(eq(subscriptions.status, 'active'))

// Churn Rate
const churn = cancelledInMonth / totalLastMonth

// Active Tenants
const active = await db.query.subscriptions.count()
  .where(eq(subscriptions.status, 'active'))
```

---

## Conclusão

Arquitetura **production-ready** para SaaS escalável:
- Isolamento completo de dados
- Múltiplos níveis de segurança
- Feature flags para monetização
- Auditoria completa
- Fácil multi-tenant

Pronto para adicionar novos módulos, planos e integrações!
