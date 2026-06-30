# Sistema SaaS Multi-Tenant - Implementação Completa

## Visão Geral

Transformação do G-LAB de aplicação monolítica para **plataforma SaaS rentável** com suporte a múltiplos tenants (clientes) isolados.

**Modelo:** Database per Tenant (máxima segurança e isolamento)
**Status:** Phase 1 ✅ Completo | Phase 2-5 🔄 Em Desenvolvimento

---

## Fases de Implementação

### ✅ PHASE 1: Database Routing & Tenant Context (COMPLETO)

**O que foi feito:**

#### 1. Banco de Dados Multi-Tenant
- Criadas 5 tabelas no MASTER DB:
  - `tenants` - Informações de cada tenant (slug, plan, status, database URL)
  - `tenantMembers` - Usuários e papéis (owner, admin, member)
  - `tenantBranding` - Customização de logo, cores, tema
  - `tenantPlans` - Planos disponíveis (free, pro, enterprise)
  - `tenantSubscriptions` - Assinatura e billing

#### 2. Tenant Context Hook
- `hooks/use-tenant.ts` - Contexto React para acessar tenant atual
- Disponibiliza: ID, slug, name, plan, branding colors

#### 3. Database Routing
- `lib/tenant-db.ts` - Conexões dinâmicas com DBs isolados
- `getTenantDb()` - Reutiliza/cria conexão com banco do tenant
- Cache de conexões para performance

#### 4. Middleware Estendido
- Suporta: /admin/* (master) e /{tenantSlug}/* (tenant)
- Armazena tenant slug em header
- Proteção: auth + inactivity timeout

#### 5. APIs de Gestão
- `POST /api/tenants` - Criar novo tenant com DB isolado
- `GET /api/tenants` - Listar tenants (admin)
- `PATCH /api/tenants/[tenantId]/branding` - Salvar branding

**Arquitetura:**
```
┌─────────────────────────────────────────┐
│    Master Database (Neon)               │
│  ┌──────────────────────────────────┐  │
│  │ • tenants                        │  │
│  │ • tenantMembers                  │  │
│  │ • tenantBranding                 │  │
│  │ • tenantPlans                    │  │
│  │ • tenantSubscriptions            │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
          ↓ (routing via middleware)
    ┌─────────────────┐
    │ Tenant DB 1     │
    │ (empresa A)     │
    └─────────────────┘
    
    ┌─────────────────┐
    │ Tenant DB 2     │
    │ (empresa B)     │
    └─────────────────┘
    
    ┌─────────────────┐
    │ Tenant DB N     │
    │ (empresa N)     │
    └─────────────────┘
```

---

### 🔄 PHASE 2: Branding & Customization UI (EM DESENVOLVIMENTO)

**O que será feito:**

Cada tenant pode customizar:
- Logo (upload de imagem)
- Cores primária/secundária/acento
- Tema (dark/light)
- Favicon

#### Components
- `BrandingForm` - Formulário com color pickers
- `LogoUploader` - Upload e preview de logo
- `ColorPicker` - Seletor visual de cores
- `BrandingPreview` - Preview em tempo real

#### Pages
- `/{tenantSlug}/settings/branding` - Dashboard de customização
- Integração com `TenantProvider` para aplicar cores

#### Features
- Real-time preview
- CSS variables dinâmicas
- Validação de cores (hex format)
- Salva via API `/api/tenants/[tenantId]/branding`

---

### 🔄 PHASE 3: Master Admin Panel (PLANEJADO)

**O que será feito:**

Admin Master gerencia:

#### Gestão de Tenants
- Listar/criar/suspender tenants
- Atribuir planos
- Visualizar uso/limites

#### Gestão de Planos
- Criar planos com limites (max users, orders, etc)
- Gerenciar preços

#### Gestão de Billing
- Visualizar receita
- Manualista ou integração Stripe

#### Monitoramento
- Dashboard com KPIs
- Uso por tenant
- Health check de DBs

#### Pages
- `/admin/tenants` - Gestão de tenants
- `/admin/plans` - Gestão de planos
- `/admin/billing` - Billing dashboard
- `/admin/monitoring` - Monitoramento

---

### 🔄 PHASE 4: Multi-Tenant Dashboard & Features (PLANEJADO)

**O que será feito:**

Cada tenant acessa dashboard próprio com dados isolados:

#### URLs
- `/{tenantSlug}/dashboard` - Dashboard principal
- `/{tenantSlug}/orders` - Ordens de serviço
- `/{tenantSlug}/clients` - Clientes
- `/{tenantSlug}/technicians` - Técnicos
- `/{tenantSlug}/financial` - Financeiro

#### Features
- Todos dados filtrados por tenant
- User management por tenant
- Papéis e permissões (owner, admin, member)
- Branding aplicado em cada página

#### Database Isolation
- Middleware detecta /{tenantSlug}
- getTenantDb() conecta ao DB correto
- Todas queries filtradas por usuário do tenant

---

### 🔄 PHASE 5: Stripe Integration & Billing (PLANEJADO)

**O que será feito:**

Sistema de pagamento e billing:

#### Stripe Setup
- Criação de produtos por plano
- Webhooks para eventos de assinatura
- Portal de gerenciamento de billing

#### Billing Pages
- Página de planos com CTA
- Checkout via Stripe
- Gerenciamento de assinatura (upgrade/downgrade/cancel)

#### Admin Controls
- Criar/atualizar assinaturas manualmente
- Visualizar recibos
- Gerenciar cupons/descontinuos

#### APIs
- `POST /api/checkout` - Iniciar checkout Stripe
- `POST /api/webhooks/stripe` - Webhook handler
- `GET /api/subscriptions/[tenantId]` - Status assinatura

---

## Stack Tecnológico

### Backend
- **Framework:** Next.js 16 (App Router)
- **Database:** Neon PostgreSQL (Master + Tenant DBs)
- **ORM:** Drizzle ORM
- **Auth:** Better Auth + bcrypt
- **API:** REST + Webhooks (Stripe)

### Frontend
- **UI Framework:** React 19
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui
- **State:** Context API + SWR

### Infrastructure
- **Hosting:** Vercel
- **Database:** Neon (PostgreSQL managed)
- **Payments:** Stripe
- **Storage:** Vercel Blob (logos/uploads)

---

## URLs & Rotas

### Master Admin (admin@glabcursos.com)
```
/admin                          → Home admin
/admin/dashboard-intelligence   → KPIs master
/admin/tenants                  → Gerenciar tenants
/admin/plans                    → Gerenciar planos
/admin/billing                  → Billing master
```

### Tenant Dashboard (usuario@empresa.com)
```
/{tenantSlug}                   → Home tenant
/{tenantSlug}/dashboard         → Dashboard principal
/{tenantSlug}/orders            → Ordens de serviço
/{tenantSlug}/clients           → Clientes
/{tenantSlug}/settings/branding → Customização
/{tenantSlug}/settings          → Configurações
```

### APIs
```
GET    /api/tenants                              → Listar tenants
POST   /api/tenants                              → Criar tenant
GET    /api/tenants/[tenantId]/branding          → Obter branding
PATCH  /api/tenants/[tenantId]/branding          → Atualizar branding
POST   /api/auth/signin                          → Login
POST   /api/auth/logout                          → Logout
POST   /api/checkout                             → Stripe checkout (future)
POST   /api/webhooks/stripe                      → Stripe webhook (future)
```

---

## Fluxo de Onboarding de Novo Tenant

```
1. Admin Master cria tenant via /admin/tenants
   ↓
2. Sistema cria novo banco PostgreSQL isolado
   ↓
3. Sistema insere tenant no Master DB
   ↓
4. Branding default criado (cores profissionais)
   ↓
5. Tenant Slug gerado (ex: "empresa-a")
   ↓
6. Admin convida usuários da empresa
   ↓
7. Usuários fazem login em /login
   ↓
8. Sistema detecta tenant do usuário
   ↓
9. Redireciona para /{tenantSlug}/dashboard
   ↓
10. Usuário acessa dados isolados da empresa
    ↓
11. Owner customiza branding em /{tenantSlug}/settings/branding
```

---

## Modelo de Dados - Schema Multi-Tenant

### Master Database (admin@glabcursos.com)

```sql
-- Tenants
CREATE TABLE tenants (
  id uuid PRIMARY KEY,
  slug varchar UNIQUE NOT NULL,     -- "empresa-a"
  name varchar NOT NULL,            -- "Empresa A"
  email varchar NOT NULL,
  databaseUrl text NOT NULL,        -- postgres://...tenant_empresa_a
  databaseName varchar NOT NULL,    -- "tenant_empresa_a"
  ownerUserId text NOT NULL,
  plan varchar DEFAULT 'free',      -- free, pro, enterprise
  status varchar DEFAULT 'active',  -- active, suspended, deleted
  createdAt timestamp,
  updatedAt timestamp,
  deletedAt timestamp
);

-- Membros de cada tenant
CREATE TABLE tenantMembers (
  id uuid PRIMARY KEY,
  tenantId uuid REFERENCES tenants(id) ON DELETE CASCADE,
  userId text REFERENCES user(id) ON DELETE CASCADE,
  role varchar DEFAULT 'member',    -- owner, admin, member
  createdAt timestamp
);

-- Branding customizável por tenant
CREATE TABLE tenantBranding (
  id uuid PRIMARY KEY,
  tenantId uuid UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  logoUrl text,
  primaryColor varchar DEFAULT '#3B82F6',
  secondaryColor varchar DEFAULT '#06B6D4',
  accentColor varchar DEFAULT '#10B981',
  backgroundColor varchar DEFAULT '#0B0F19',
  textColor varchar DEFAULT '#F1F5F9',
  theme varchar DEFAULT 'dark',     -- dark, light
  favicon text,
  createdAt timestamp,
  updatedAt timestamp
);

-- Planos disponíveis
CREATE TABLE tenantPlans (
  id uuid PRIMARY KEY,
  name varchar UNIQUE NOT NULL,     -- "Professional"
  slug varchar UNIQUE NOT NULL,     -- "professional"
  description text,
  price decimal,
  billingCycle varchar,             -- monthly, yearly
  maxUsers integer,
  maxClients integer,
  maxServiceOrders integer,
  features text,                    -- JSON
  active boolean DEFAULT true,
  createdAt timestamp,
  updatedAt timestamp
);

-- Assinatura de cada tenant
CREATE TABLE tenantSubscriptions (
  id uuid PRIMARY KEY,
  tenantId uuid UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  planId uuid REFERENCES tenantPlans(id),
  stripeSubscriptionId text,
  status varchar DEFAULT 'active',  -- active, canceled, past_due
  currentPeriodStart timestamp,
  currentPeriodEnd timestamp,
  createdAt timestamp,
  updatedAt timestamp
);
```

### Tenant Database (um para cada tenant)

```sql
-- Mesmo schema que Master + dados específicos do tenant
CREATE TABLE "user" (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  emailVerified boolean DEFAULT false,
  image text,
  createdAt timestamp,
  updatedAt timestamp
);

-- Clientes da empresa
CREATE TABLE clientes (
  id serial PRIMARY KEY,
  userId text NOT NULL,           -- Usuário que criou
  nome text NOT NULL,
  email text,
  telefone text,
  cpf_cnpj text UNIQUE,
  -- ... outros campos
  createdAt timestamp,
  updatedAt timestamp
);

-- Ordens de serviço
CREATE TABLE ordens_servico (
  id serial PRIMARY KEY,
  userId text NOT NULL,
  numero varchar UNIQUE,
  cliente_id integer,
  tecnico_id integer,
  descricao text,
  -- ... outros campos
  createdAt timestamp,
  updatedAt timestamp
);

-- Técnicos
CREATE TABLE tecnicos (
  id serial PRIMARY KEY,
  userId text NOT NULL,
  nome text NOT NULL,
  email text,
  -- ... outros campos
  createdAt timestamp,
  updatedAt timestamp
);
```

---

## Security & Isolation

### Isolamento de Dados

1. **Database per Tenant**
   - Cada tenant tem banco PostgreSQL isolado
   - Não há risco de SQL injection afetando outro tenant
   - Backups isolados por tenant

2. **Row-Based Filtering**
   - Queries no Tenant DB filtram por `userId`
   - Middleware valida tenant slug antes de conectar

3. **User Context**
   - Auth session contém user ID
   - Middleware verifica se user pertence ao tenant
   - APIs usam userId para filtrar dados

### Middleware Security
```typescript
// Middleware valida:
1. Auth session existe (auth_session cookie)
2. User não está inativo (30 min timeout)
3. Tenant slug é válido (regex: [a-z0-9-]+)
4. User é membro do tenant (via tenantMembers table)
```

---

## Próximos Passos

### Imediato (MVP)
- [ ] Completar Phase 2: Branding UI
- [ ] Criar tenant dashboard básico
- [ ] User management por tenant
- [ ] Testar isolamento de dados

### Curto prazo (v1)
- [ ] Phase 3: Master Admin Panel
- [ ] Phase 4: Multi-Tenant Features
- [ ] Documentação API completa
- [ ] Load testing multi-tenant

### Médio prazo (v2)
- [ ] Phase 5: Stripe Integration
- [ ] Analytics por tenant
- [ ] Advanced permissions
- [ ] API webhooks

### Longo prazo (v3+)
- [ ] SSO (SAML/OAuth)
- [ ] API publica para integrações
- [ ] White-label completo
- [ ] Custom domain por tenant

---

## Exemplo: Criando um Novo Tenant

### Via Admin Panel
```
1. Acessa: /admin/tenants
2. Clica "New Tenant"
3. Preenche:
   - Name: "Empresa Exemplo"
   - Email: "admin@empresa-exemplo.com"
   - Slug: "empresa-exemplo"
   - Plan: "professional"
4. Clica "Create"
5. Sistema cria:
   - Novo banco: tenant_empresa_exemplo
   - Entrada em Master DB
   - Branding default
6. Admin convida usuários
7. Usuários acessam: /empresa-exemplo/dashboard
```

### Via API
```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_session=..." \
  -d '{
    "name": "Empresa Exemplo",
    "email": "admin@empresa-exemplo.com",
    "slug": "empresa-exemplo",
    "plan": "professional",
    "ownerUserId": "user_123"
  }'

Response:
{
  "success": true,
  "tenant": {
    "id": "uuid",
    "slug": "empresa-exemplo",
    "name": "Empresa Exemplo",
    "plan": "professional",
    "status": "active"
  }
}
```

---

## Resumo Técnico

| Aspecto | Implementação |
|---------|---------------|
| Multi-Tenancy | Database per Tenant |
| Isolation | Banco isolado + Row filtering |
| Authentication | Better Auth + bcrypt |
| Authorization | Role-based (owner/admin/member) |
| Database | Neon PostgreSQL (Master + Tenants) |
| ORM | Drizzle ORM |
| Caching | Connection pool + React cache |
| Branding | CSS variables dinâmicos |
| Billing | Stripe (em desenvolvimento) |
| Monitoring | Dashboard admin |
| Security | Middleware + HTTPS + rate limiting |

---

## Status: Phase 1 ✅ Completo

Próxima: Phase 2 - Branding UI (em desenvolvimento)

Build: ✓ Compilado com sucesso
Deploy: Pronto para Vercel
