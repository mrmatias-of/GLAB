# Bright Draft - Arquitetura de Separação

## Visão Geral

O projeto está estruturado em **3 camadas completamente independentes**:

1. **Home Page Pública** (`/`)
2. **Painel/Dashboard Protegido** (`/admin`, `/login`, `/sign-in`, `/master`)
3. **API Backend** (`/api/*`)

---

## 1. HOME PAGE PÚBLICA (/) 

### Rotas
- `/` - Home page
- `/contato` - Página de contato
- `/privacidade` - Política de privacidade
- `/termos` - Termos de serviço
- Outras páginas públicas

### Componentes
```
app/
├── page.tsx                (Home)
├── layout.tsx              (Root layout - INDEPENDENT)
└── components/
    ├── header.tsx
    ├── hero.tsx
    ├── footer.tsx
    └── ... (other public components)
```

### Características
- **Independente:** Usa próprio layout
- **Público:** Sem autenticação necessária
- **Estático:** Pode ser cachado
- **Rápido:** Sem chamadas de API necessárias
- **Design:** Próprio design e tema

### Importante
⚠️ **NÃO MEXER** no layout.tsx da home page
- Mantém próprio estado de CSS
- Não herda configurações do painel
- Completamente isolado

---

## 2. PAINEL/DASHBOARD PROTEGIDO

### Rotas
```
/admin              - Admin dashboard
/login              - Login page
/sign-in            - Sign-in (Better Auth)
/sign-up            - Sign-up (Better Auth)
/master             - Master dashboard
```

### Proteção
- Middleware em `proxy.ts` valida autenticação
- Sessão Better Auth necessária
- Rate limiting ativo
- CSRF tokens validados

### Características
- **Protegido:** Requer login
- **Multi-tenant:** Isolamento por tenant
- **Dinâmico:** Dados em tempo real
- **Hardened:** Todas validações de segurança ativas

---

## 3. API BACKEND (/api/*)

### Endpoints (68 rotas)
```
/api/auth/*                  - Autenticação (Better Auth)
/api/clientes/*              - Gerenciamento de clientes
/api/comissoes/*             - Comissões
/api/dashboard/*             - Dados do dashboard
/api/estoque/*               - Inventário
/api/financeiro/*            - Financeiro
/api/notificacoes/*          - Notificações
/api/ordens-servico/*        - Ordens de serviço
/api/relatorios/*            - Relatórios
/api/rh/*                    - RH (HR)
/api/roteamento/*            - Roteamento
/api/servicos/*              - Serviços
/api/tecnicos/*              - Técnicos
/api/upload/*                - Upload de arquivos
/api/ocr/*                   - OCR (Document processing)
/api/track/*                 - Rastreamento
```

### Proteção
- Autenticação obrigatória
- Validação com Zod
- Rate limiting
- CSRF tokens (POST/PUT/DELETE)
- Multi-tenant enforcement
- Error handling padronizado

### Características
- **Stateless:** Sem estado de sessão
- **RESTful:** Endpoints bem definidos
- **Validado:** Input validation em todas rotas
- **Hardened:** Segurança OWASP

---

## Arquitetura Visual

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴─────────────┐
        │                          │
        ▼                          ▼
┌──────────────────┐      ┌──────────────────┐
│  Home Page (/)   │      │  Dashboard/API   │
└──────────────────┘      └────────┬─────────┘
│ /                                 │
│ /contato                          │ /admin
│ /privacidade                      │ /login
│ /termos                           │ /sign-in
│                                   │ /api/*
├─ Independent                      ├─ Protected
├─ Public                           ├─ Auth Required
├─ Static Assets                    ├─ Multi-tenant
├─ Own Layout                       ├─ Rate Limited
└─ No Auth                          └─ CSRF Protected

SEPARATION: ✅ COMPLETE
- Home: Own layout.tsx
- Dashboard: Own routes
- API: Own validation
```

---

## Middleware (proxy.ts)

### Comportamento

**Para rotas públicas (/):**
```
Request → Skip Middleware → Response
```

**Para rotas protegidas (/admin, /api/*):**
```
Request → Auth Check → Tenant Discovery → CSRF Validation → Rate Limit → Response
```

### Rotas Afetadas
```
✓ /admin/*         - Protected
✓ /api/*           - Protected  
✓ /sign-in/*       - Protected
✓ /login/*         - Protected
✓ /master/*        - Protected

✗ /                - Público (skip middleware)
✗ /contato         - Público (skip middleware)
✗ /privacidade     - Público (skip middleware)
✗ /_next/*         - Static (skip middleware)
```

---

## Como Trabalhar com Isso

### Adicionar Feature na Home Page
1. Editar arquivos em `app/` (root)
2. Usar `app/layout.tsx` existente
3. Adicionar componentes em `components/`
4. ✅ Não afeta painel ou API

### Adicionar Feature no Painel
1. Editar arquivos em `/admin` ou `/login`
2. Usar autenticação necessária
3. Chamar endpoints `/api/*`
4. ✅ Não afeta home page ou outras features

### Adicionar Endpoint na API
1. Criar arquivo em `app/api/*/route.ts`
2. Usar services em `src/modules/*/services/`
3. Validar com Zod schemas
4. ✅ Disponível para qualquer cliente autenticado

---

## Deployment

### Estrutura no Servidor
```
Vercel/Server
├── / (Home page - cache estático)
├── /admin (Painel - gerenciado por auth)
└── /api (Backend - rate limited)
```

### Variáveis de Ambiente Necessárias
```
# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=<generated>
AUTH_TRUST_HOST=localhost,your-domain.com

# Optional: API Keys
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

---

## Testes

### Home Page
```bash
curl http://localhost:3000/
# Status: 200
# No auth required
```

### Painel (sem autenticação)
```bash
curl http://localhost:3000/admin
# Status: 401 ou redirect para /login
```

### API (sem autenticação)
```bash
curl http://localhost:3000/api/clientes
# Status: 401
# {"error": "Unauthorized"}
```

### API (com autenticação)
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/clientes
# Status: 200
# [{"id": 1, "nome": "...", ...}]
```

---

## Resumo

| Item | Home Page | Painel | API |
|------|-----------|--------|-----|
| Rota | `/` | `/admin`, `/login` | `/api/*` |
| Auth | ❌ Não | ✅ Sim | ✅ Sim |
| Layout | Próprio | Próprio | N/A |
| Cache | ✅ Sim | ❌ Não | ⚠️ Condicional |
| Rate Limit | ❌ Não | ✅ Sim | ✅ Sim |
| Validação | ⚠️ Manual | ✅ Zod | ✅ Zod |
| CSRF | ❌ Não | ✅ Sim | ✅ Sim |
| Multi-tenant | ❌ Não | ✅ Sim | ✅ Sim |

---

## Status Atual

✅ **Home Page:** Independente e funcionando
✅ **Painel:** Protegido e funcional
✅ **API:** 68 rotas implementadas
✅ **Middleware:** Separação clara
✅ **Build:** Sem erros

Tudo separado e funcionando conforme esperado!
