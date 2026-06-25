# CONFIGURAÇÃO EXCLUSIVA: MYSQL LOCAWEB

## DIAGNÓSTICO FINAL

### STATUS ATUAL: CONFLITO CRÍTICO ENCONTRADO

```
❌ PRISMA SCHEMA
   provider = "postgresql"  ← DEVE SER "mysql"

❌ .env.development.local
   DATABASE_URL = "postgresql://neondb_owner:***@neon.tech"  ← DEVE SER MySQL Locaweb

❌ .env
   DATABASE_URL = "prisma+postgres://..."  ← POSTGRES (LOCAL DEV, vai ser removido)

❌ PACKAGE.JSON
   "pg": "^8.22.0"  ← DRIVER POSTGRESQL (deve ser MySQL2)
   "@types/pg": "^8.20.0"  ← TIPOS POSTGRESQL (deve ser @types/mysql2)
```

---

## 1. LISTA COMPLETA DE CONFIGURAÇÕES DE BANCO

### 1.1 PRISMA SCHEMA (schema.prisma)
**ATUAL:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**CORRETO PARA MYSQL:**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

**STATUS:** ❌ INCORRETO - Precisa mudar

---

### 1.2 ARQUIVO: .env.development.local
**ATUAL (3 linhas):**
```
# PostgreSQL / Neon Configuration
# DATABASE_URL is required for Prisma to connect to Neon
DATABASE_URL='postgresql://neondb_owner:npg_TUjeFp6J4nCo@ep-solitary-lake-ad8kch7d-pooler.c-2.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'
```

**CORRETO PARA MYSQL LOCAWEB:**
```
# MySQL Locaweb Configuration
DATABASE_URL='mysql://glabcursos_db:PASSWORD@glabcursos_db.mysql.dbaas.com.br:3306/glabcursos_db'
```

**STATUS:** ❌ INCORRETO - Apontando para Neon

---

### 1.3 ARQUIVO: .env
**ATUAL:**
```
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=..."
```

**STATUS:** ⚠️ INVÁLIDO - Prisma Dev Server local (será removido, não usado em produção)

---

### 1.4 ARQUIVO: .env.production
**STATUS:** ✗ Não existe (Vercel usa variáveis de ambiente do Dashboard)

---

### 1.5 PACKAGE.JSON - Dependências
**ATUAL (INVÁLIDO):**
```json
"pg": "^8.22.0",
"@types/pg": "^8.20.0",
"@prisma/client": "^5.22.0",
"prisma": "^5.22.0"
```

**CORRETO PARA MYSQL:**
```json
"mysql2": "^3.x.x",
"@prisma/client": "^5.22.0",
"prisma": "^5.22.0"
```

**STATUS:** ❌ INCORRETO - Tem dependência PostgreSQL

---

## 2. IDENTIFICAÇÃO DE REFERÊNCIAS INVÁLIDAS

### 2.1 CÓDIGO COM "POSTGRES" OU "NEON"
**16 arquivos encontrados** que contêm a palavra "postgres" (provavelmente em comentários ou nomes):
- `./app/(public)/grupo-vip/page.tsx`
- `./app/(public)/panicfull/page.tsx`
- `./app/admin/layout.tsx`
- `./app/cursos/[slug]/page.tsx`
- `./app/cursos/combo-iniciante-mobile/page.tsx`
- `./app/cursos/page.tsx`
- `./app/layout.tsx`
- `./app/login/page.tsx`
- `./components/admin/image-crop-upload.tsx`
- `./components/admin/sidebar.tsx`
- `./components/header.tsx`
- `./components/hero.tsx`
- `./components/landing/combo-authority-section.tsx`
- `./components/landing/combo-landing-header.tsx`
- `./middleware.ts`

**ANÁLISE:** Provavelmente são apenas comentários ou "POSTGRES" como part de outro termo. Requer verificação individual.

### 2.2 VARIÁVEIS DE AMBIENTE INVÁLIDAS
**RUNTIME:**
- ✗ DATABASE_URL: NÃO DEFINIDA (será definida no .env.development.local)
- ✓ POSTGRES_URL: NÃO DEFINIDA (correto)
- ✓ PGHOST: NÃO DEFINIDA (correto)
- ✓ NEON_*: NÃO DEFINIDAS (correto)

---

## 3. CONFIGURAÇÃO CORRETA FINAL

### 3.1 O QUE DEVE SER REMOVIDO

**Prisma Schema:**
- [x] `provider = "postgresql"` → Mudar para `provider = "mysql"`

**Package.json:**
- [x] `"pg": "^8.22.0"` → Remover
- [x] `"@types/pg": "^8.20.0"` → Remover
- [x] Adicionar `"mysql2": "^3.x.x"`

**.env.development.local:**
- [x] Remover comentários PostgreSQL/Neon
- [x] Remover DATABASE_URL Neon
- [x] Adicionar DATABASE_URL MySQL Locaweb

**.env:**
- [x] Remover ou deixar comentado (Prisma Dev Server não será usado)

**Vercel Dashboard (Environment Variables):**
- [x] Remover qualquer POSTGRES_URL
- [x] Remover qualquer NEON_*
- [x] Remover qualquer PGHOST, PGUSER, PGDATABASE, etc.
- [x] Confirmar DATABASE_URL aponta para MySQL Locaweb

---

### 3.2 O QUE DEVE SER MANTIDO

**Prisma Schema:**
- ✓ `provider = "mysql"` (quando atualizado)
- ✓ `url = env("DATABASE_URL")`

**Package.json:**
- ✓ `"@prisma/client": "^5.22.0"`
- ✓ `"prisma": "^5.22.0"`
- ✓ `"mysql2": "^3.x.x"` (novo)

**.env.development.local:**
- ✓ `DATABASE_URL='mysql://glabcursos_db:PASSWORD@glabcursos_db.mysql.dbaas.com.br:3306/glabcursos_db'`

**Vercel Dashboard (Environment Variables):**
- ✓ `DATABASE_URL='mysql://glabcursos_db:PASSWORD@glabcursos_db.mysql.dbaas.com.br:3306/glabcursos_db'`

---

## 4. CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Atualizar Prisma Schema
- [ ] Mudar `provider` de "postgresql" para "mysql"
- [ ] Executar: `pnpm prisma generate`
- [ ] Executar: `pnpm build`

### Fase 2: Atualizar Package.json
- [ ] Remover `"pg": "^8.22.0"`
- [ ] Remover `"@types/pg": "^8.20.0"`
- [ ] Adicionar `"mysql2": "^3.x.x"`
- [ ] Executar: `pnpm install`

### Fase 3: Atualizar .env.development.local
- [ ] Remover DATABASE_URL Neon
- [ ] Adicionar DATABASE_URL MySQL Locaweb
- [ ] Confirmar credenciais corretas

### Fase 4: Atualizar Vercel Dashboard
- [ ] Ir para: Settings → Environment Variables
- [ ] Remover qualquer POSTGRES_URL
- [ ] Remover qualquer variável NEON_*
- [ ] Remover qualquer variável PG*
- [ ] Confirmar DATABASE_URL aponta para MySQL Locaweb

### Fase 5: Validação Final
- [ ] Build local bem-sucedido: `pnpm build`
- [ ] Conexão MySQL funcionando
- [ ] Deploy em produção bem-sucedido
- [ ] Login testado em produção

---

## 5. RESUMO EXECUTIVO

| Item | Antes | Depois |
|------|-------|--------|
| **Provider** | postgresql ❌ | mysql ✓ |
| **Database** | Neon (PostgreSQL) ❌ | MySQL Locaweb ✓ |
| **Dependencies** | pg, @types/pg ❌ | mysql2 ✓ |
| **.env** | Neon URL ❌ | MySQL Locaweb URL ✓ |
| **Conflito** | SIM ❌ | NÃO ✓ |

---

## PRÓXIMAS AÇÕES

1. **Implementar mudanças acima**
2. **Testar em desenvolvimento**
3. **Deploy em produção**
4. **Validar conexão MySQL em produção**
5. **Remover arquivo de diagnostic se não mais necessário**
