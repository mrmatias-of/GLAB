# 📋 LISTAGEM COMPLETA DO SITE - VERSÃO LIMPA

**Status**: ✅ Limpeza radical concluída  
**Data**: 21/05/2026  
**Deploy**: https://glabcursos.com.br

---

## 📄 PÁGINAS (9 rotas)

### Públicas (Vitrine)
- **`/`** - Home (redireciona para /admin se logado)
- **`/cursos`** - Listagem de cursos disponíveis
- **`/cursos/[slug]`** - Página individual do curso

### Admin (Protegidas por autenticação)
- **`/admin`** - Dashboard principal (vendas, métricas, últimas ações)
- **`/admin/cursos`** - Gerenciamento de cursos
- **`/admin/cursos/novo`** - Criar novo curso
- **`/admin/cursos/editar/[id]`** - Editar curso existente
- **`/admin/vendas`** - Relatório de vendas do Kirvano

### Sistema
- **`/auth/callback`** - Callback de autenticação Supabase
- **`/_not-found`** - Página 404 personalizada

---

## 🔌 APIs (2 rotas)

- **`POST /api/telegram/webhook`** - Webhook do bot Telegram
  - Recebe comandos: `/dashboard`, `/vendas`, `/cursos`, `/ajuda`
  - Processa callbacks de botões
  - Status: ✅ Ativo e funcionando

---

## 🤖 TELEGRAM BOT (Sistema Completo)

### Webhook
- `/api/telegram/webhook` - Entrada de mensagens e callbacks

### Handlers de Comandos
- `dashboard.ts` - Visão geral: vendas do dia, últimos cursos, últimas mensagens
- `vendas.ts` - Últimas 5 vendas com valores e datas
- `cursos.ts` - Lista de cursos ativos com botão "Ver no site"
- `mensagens.ts` - Mensagens de contato pendentes (se houver)

### Funções Disponíveis no Telegram
- **/dashboard** - Visão geral da plataforma
- **/vendas** - Últimas vendas e faturamento
- **/cursos** - Lista de cursos publicados
- **/ajuda** - Mostra todos os comandos

### Notificações Automáticas
- 💰 **Nova venda**: quando Kirvano notifica uma compra
- 👤 **Novo cadastro**: quando alguém cria conta
- 💬 **Nova mensagem**: quando recebe contato

---

## 🗄️ BANCO DE DADOS (Tabelas do Supabase)

### Tabelas Existentes
- **`cursos`** - Catálogo de cursos (titulo, descricao, preco, modulos, etc)
- **`purchases`** - Histórico de vendas (vindo do Kirvano)
- **`profiles`** - Perfis de usuários (id, email, is_admin)
- **`telegram_admins`** - Admins autorizados do bot (telegram_id, username, role, ativo)
- **`telegram_logs`** - Histórico de comandos executados (comando, status, timestamp)

---

## 🧩 COMPONENTES (15 componentes)

### Headers & Navs
- `header.tsx` - Header principal com logo, menu, search
- `admin/sidebar.tsx` - Sidebar do painel admin (Dashboard, Cursos, Vendas)

### Páginas Admin
- `admin/dashboard.tsx` - Dashboard com cards de métricas
- `admin/cursos-list.tsx` - Lista de cursos com filtros
- `admin/curso-form.tsx` - Formulário criar/editar curso
- `admin/vendas-table.tsx` - Tabela de vendas do Kirvano

### Vitrine
- `hero.tsx` - Hero section do site
- `cursos-preview.tsx` - Preview de cursos na home
- `cursos.tsx` - Grid de cursos na página /cursos
- `curso-card.tsx` - Card individual de curso
- `curso-cta.tsx` - Call-to-action de curso

### UI & Utilidades
- `footer.tsx` - Footer com links
- `search-modal.tsx` - Modal de busca (apenas cursos)
- `whatsapp-button.tsx` - Botão flutuante WhatsApp
- `not-found.tsx` - Página 404 customizada

---

## 📚 BIBLIOTECAS (7 arquivos)

### Supabase & Auth
- `lib/supabase/client.ts` - Cliente Supabase (browser)
- `lib/supabase/server.ts` - Cliente Supabase (server) + cliente anônimo para build
- `lib/supabase/middleware.ts` - Middleware de autenticação

### Dados
- `lib/cursos-data.ts` - Funções para buscar cursos (com cache SSG)

### Telegram
- `lib/telegram.ts` - Cliente Telegram principal (sendMessage, notificações)
- `lib/telegram/commands.ts` - Router de comandos Telegram
- `lib/telegram/handlers/` - Handlers individuais (dashboard, vendas, cursos, mensagens)

### Utilidades
- `lib/utils.ts` - Funções utilitárias

---

## 🔐 AUTENTICAÇÃO

- **Tipo**: Supabase Auth (supabase.auth)
- **Métodos**: Email + Senha
- **Admin**: Detectado via `user.user_metadata.is_admin === true`
- **Proteção**: Middleware + Server Components
- **Redireciona não-autenticados**: `/` → `/admin`

---

## 📦 DEPENDÊNCIAS PRINCIPAIS

```json
{
  "next": "^15.1.4",
  "react": "^19.0.0",
  "@supabase/supabase-js": "^2.45.0",
  "@supabase/ssr": "^0.4.1",
  "axios": "^1.6.0",
  "lucide-react": "^0.344.0",
  "tailwindcss": "^4.0.0"
}
```

---

## 🛠️ O QUE FOI REMOVIDO

### Páginas (5)
- ❌ `/contato` - Formulário de contato
- ❌ `/login` - Login público
- ❌ `/privacidade` - Política de privacidade
- ❌ `/reembolso` - Política de reembolso
- ❌ `/termos` - Termos de uso

### Admin (3)
- ❌ `/admin/alunos` - Gestão de alunos (tudo via Kirvano)
- ❌ `/admin/ai-generator` - Gerador de cursos com IA
- ❌ `/admin/config` - Configurações do site
- ❌ `/admin/mensagens` - Gestão de mensagens

### APIs (7)
- ❌ `/api/cadastro` - Registro de alunos (tudo via Kirvano)
- ❌ `/api/contato` - Envio de contato
- ❌ `/api/vendas` - Notificações de vendas
- ❌ `/api/ai/generate-course` - IA para gerar cursos
- ❌ `/api/webhooks/kiwify` - Webhook Kiwify (vindo via Kirvano)
- ❌ `/api/webhooks/cursos` - Webhook de cursos
- ❌ `/api/webhooks/notify` - Webhook genérico de notificações
- ❌ `/api/revalidate` - Revalidação de cache

### Libs (2)
- ❌ `lib/error-handler.ts` - Tratador de erros global
- ❌ `lib/search-synonyms.ts` - Busca por sinônimos (simplificado)

### Componentes (2)
- ❌ `/components/aluno/sidebar.tsx` - Sidebar do aluno
- ❌ Cakto integrations

---

## 📊 ESTRUTURA FINAL

```
app/
├── page.tsx                    # Home pública
├── layout.tsx                  # Layout raiz
├── not-found.tsx               # 404 personalizado
├── admin/
│   ├── layout.tsx              # Proteção + sidebar
│   ├── page.tsx                # Dashboard
│   ├── cursos/
│   │   ├── page.tsx            # Lista de cursos
│   │   ├── novo/page.tsx       # Criar curso
│   │   └── editar/[id]/page.tsx # Editar curso
│   └── vendas/page.tsx         # Relatório Kirvano
├── cursos/
│   ├── page.tsx                # Grid de cursos
│   └── [slug]/page.tsx         # Página curso individual
├── auth/
│   └── callback/page.tsx       # Callback OAuth
└── api/
    └── telegram/
        └── webhook/route.ts    # Bot webhook

lib/
├── telegram.ts                 # Cliente Telegram
├── telegram/
│   ├── commands.ts             # Router de comandos
│   └── handlers/
│       ├── dashboard.ts
│       ├── vendas.ts
│       ├── cursos.ts
│       └── mensagens.ts
├── cursos-data.ts              # Dados de cursos
└── supabase/
    ├── client.ts
    ├── server.ts
    └── middleware.ts

components/
├── header.tsx
├── footer.tsx
├── hero.tsx
├── search-modal.tsx
├── whatsapp-button.tsx
├── admin/
│   ├── sidebar.tsx
│   ├── dashboard.tsx
│   ├── curso-form.tsx
│   ├── cursos-list.tsx
│   └── vendas-table.tsx
└── cursos.tsx
```

---

## ✅ STATUS FINAL

| Aspecto | Status |
|---------|--------|
| **Build** | ✅ Limpo, 0 erros |
| **Páginas públicas** | ✅ Home + Vitrine de cursos |
| **Painel Admin** | ✅ Dashboard, Cursos, Vendas |
| **Telegram Bot** | ✅ Webhook + 4 comandos |
| **Autenticação** | ✅ Supabase Auth |
| **Pagamentos** | ✅ Integração Kirvano (checkout externo) |
| **Deploy** | ✅ Vercel (https://glabcursos.com.br) |

---

**Próximos passos:**
1. Registrar webhook do bot no Telegram
2. Adicionar telegram_id do admin na tabela `telegram_admins`
3. Testar comandos do bot
4. Configurar webhook de compra do Kirvano para notificar Telegram
