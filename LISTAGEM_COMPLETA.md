# 📋 LISTAGEM COMPLETA DO SITE - GLAB CURSOS

## 1. PÁGINAS PÚBLICAS (Visitantes)

### Homepage & Exploração
- **`/` (page.tsx)** - Página inicial com Hero, Cursos destaque, Depoimentos, Stats
  - Status: ✅ Funcionando
  - Componentes: Hero, CursosPreview, Depoimentos, Stats, Professor, Footer
  - Funcionalidade: Atrai visitantes, mostra destaques dos cursos

- **`/cursos` (page.tsx)** - Página com lista completa de todos os cursos
  - Status: ✅ Funcionando
  - Componentes: Cursos, Search
  - Funcionalidade: Exibe cursos em grid com busca/filtro

- **`/cursos/[slug]` (page.tsx)** - Página individual de cada curso
  - Status: ✅ Funcionando
  - Componentes: CursoHero, CursoModulos, CursoAprendizados, CursoCTA
  - Funcionalidade: Mostra detalhes, módulos, tópicos, botão "Comprar"

### Informações Legais
- **`/termos` (page.tsx)** - Termos de Uso
  - Status: ✅ Funcionando
  - Funcionalidade: Informações legais obrigatórias

- **`/privacidade` (page.tsx)** - Política de Privacidade
  - Status: ✅ Funcionando
  - Funcionalidade: Proteção de dados e LGPD

- **`/reembolso` (page.tsx)** - Política de Reembolso
  - Status: ✅ Funcionando
  - Funcionalidade: Termos de reembolso dentro de 7 dias

### Contato & Autenticação
- **`/contato` (page.tsx)** - Formulário de contato
  - Status: ✅ Funcionando
  - Funcionalidade: Recebe mensagens via formulário, envia notificação Telegram
  - API: POST /api/contato

- **`/login` (page.tsx)** - Página de login
  - Status: ⚠️ Estrutura pronta, sem integração de auth
  - Funcionalidade: Formulário de login (não autentifica ainda)
  - Precisa: Integrar com Supabase Auth ou outro provider

### Página 404
- **`/not-found.tsx`** - Página de erro 404 personalizada
  - Status: ✅ Funcionando
  - Funcionalidade: Mostra erro quando página não existe

---

## 2. PÁGINAS DE ADMIN (Requer autenticação)

### Dashboard
- **`/admin` (page.tsx)** - Dashboard principal
  - Status: ⚠️ Estrutura pronta, dados mockados
  - Funcionalidade: Overview de vendas, alunos, cursos
  - Precisa: Conectar com dados reais do Supabase

### Gerenciamento de Cursos
- **`/admin/cursos` (page.tsx)** - Lista de cursos
  - Status: ⚠️ Estrutura pronta
  - Funcionalidade: Visualizar/editar/deletar cursos

- **`/admin/cursos/novo` (page.tsx)** - Criar novo curso
  - Status: ⚠️ Estrutura pronta
  - Funcionalidade: Formulário para adicionar curso

- **`/admin/cursos/editar/[id]` (page.tsx)** - Editar curso existente
  - Status: ⚠️ Estrutura pronta
  - Funcionalidade: Editar detalhes, módulos, tópicos

### Gerenciamento de Vendas
- **`/admin/vendas` (page.tsx)** - Histórico de vendas
  - Status: ⚠️ Estrutura pronta
  - Funcionalidade: Tabela com vendas, filtros, exportação

### Gerenciamento de Alunos
- **`/admin/alunos` (page.tsx)** - Lista de alunos
  - Status: ⚠️ Estrutura pronta
  - Funcionalidade: Ver alunos, seus cursos, progresso

### Gerenciamento de Mensagens
- **`/admin/mensagens` (page.tsx)** - Mensagens de contato
  - Status: ⚠️ Estrutura pronta
  - Funcionalidade: Visualizar/responder mensagens de contato

### IA Generator
- **`/admin/ai-generator` (page.tsx)** - Gerador de conteúdo com IA
  - Status: ⚠️ Funciona, mas lento
  - Funcionalidade: Gera descrições/módulos de cursos com IA
  - Precisa: Otimizar performance

### Configurações
- **`/admin/config` (page.tsx)** - Configurações do site
  - Status: ⚠️ Estrutura pronta
  - Funcionalidade: Editar textos, cores, configurações gerais

---

## 3. PÁGINAS DE ALUNO (Requer autenticação)

### Dashboard do Aluno
- **`/aluno` (page.tsx)** - Dashboard do aluno
  - Status: ⚠️ Estrutura pronta
  - Funcionalidade: Cursos inscritos, progresso

### Cursos do Aluno
- **`/aluno/cursos/[id]` (page.tsx)** - Assistir curso específico
  - Status: ⚠️ Estrutura pronta
  - Funcionalidade: Reprodutor de vídeo, progresso, módulos

### Minha Conta
- **`/aluno/minha-conta` (page.tsx)** - Perfil do aluno
  - Status: ⚠️ Estrutura pronta
  - Funcionalidade: Editar perfil, senha, dados pessoais

### Certificados
- **`/aluno/certificados` (page.tsx)** - Certificados conquistados
  - Status: ⚠️ Estrutura pronta
  - Funcionalidade: Download/visualização de certificados

### Notificações
- **`/aluno/notificacoes` (page.tsx)** - Centro de notificações
  - Status: ⚠️ Estrutura pronta
  - Funcionalidade: Histórico de notificações

---

## 4. APIs (Backend)

### Webhooks de Pagamento
- **`POST /api/webhooks/kiwify`** - Webhook da Kiwify
  - Status: ✅ Funcionando
  - Funcionalidade: Recebe notificações de venda, cria purchase, envia Telegram
  - Gatilhos: Venda aprovada/reembolsada

- **`POST /api/webhooks/cakto/webhook`** - Webhook da Cakto (descontinuado)
  - Status: ❌ Não está em uso
  - Pode remover

### Gerenciamento de Cursos
- **`POST /api/cakto/create-product`** - Cria produto na Cakto
  - Status: ❌ Não está em uso (Kiwify é a plataforma atual)
  - Pode remover

- **`POST /api/webhooks/cursos`** - Webhook para atualizar cursos
  - Status: ⚠️ Existente, função desconhecida
  - Precisa: Revisar se está sendo usado

### Notificações
- **`POST /api/contato`** - Recebe mensagem do formulário de contato
  - Status: ✅ Funcionando
  - Funcionalidade: Valida, salva em DB, envia Telegram

- **`POST /api/cadastro`** - Notifica novo cadastro
  - Status: ✅ Funcionando
  - Funcionalidade: Envia notificação Telegram de novo usuário

- **`POST /api/vendas`** - Notifica nova venda
  - Status: ✅ Funcionando
  - Funcionalidade: Envia notificação Telegram de venda (redundante com Kiwify)

- **`POST /api/webhooks/notify`** - Webhook genérico de notificações
  - Status: ⚠️ Existente
  - Precisa: Entender seu uso

### Bot Telegram
- **`POST /api/telegram/webhook`** - Webhook do bot Telegram
  - Status: 🔄 Implementado, aguardando registro
  - Funcionalidade: Recebe comandos do Telegram, roteia para handlers

### Revalidação
- **`POST /api/revalidate`** - Revalida cache ISR
  - Status: ✅ Funcionando
  - Funcionalidade: Atualiza cache de páginas estáticas

### IA
- **`POST /api/ai/generate-course`** - Gera conteúdo com IA
  - Status: ✅ Funcionando
  - Funcionalidade: Usa AI SDK para gerar descrições/módulos de cursos

---

## 5. COMPONENTES (React)

### Layout
- **Header** - Navegação com menu, busca, autenticação
  - Status: ✅ Funcionando
  - Recursos: Menu responsivo, search modal, botão login

- **Footer** - Rodapé com links e redes sociais
  - Status: ✅ Funcionando
  - Recursos: Links legais, contato, redes sociais

- **ThemeProvider** - Provedor de tema
  - Status: ✅ Funcionando
  - Funcionalidade: Dark mode/light mode

- **WhatsAppButton** - Botão flutuante WhatsApp
  - Status: ✅ Funcionando
  - Funcionalidade: Link direto para WhatsApp

### Homepage
- **Hero** - Seção destaque principal
  - Status: ✅ Funcionando
  - Recursos: Card principal + thumbnails, busca CTA

- **CursosPreview** - Cards de cursos destacados
  - Status: ✅ Funcionando
  - Recursos: Card grande + cards pequenos com preços

- **Depoimentos** - Testimonials de alunos
  - Status: ✅ Funcionando
  - Recursos: Carrossel de depoimentos

- **Stats** - Estatísticas (alunos, cursos, etc)
  - Status: ✅ Funcionando
  - Recursos: Números em destaque

- **Professor** - Seção "Conheça o Professor"
  - Status: ✅ Funcionando
  - Recursos: Foto, nome, descrição

### Página de Cursos
- **Cursos** - Grid de cursos com filtros
  - Status: ✅ Funcionando
  - Recursos: Cards com imagem, preço, descrição, detalhes

- **SearchModal** - Modal de busca com autocomplete
  - Status: ✅ Funcionando
  - Recursos: Busca em tempo real, sugestões de cursos

### Página Individual de Curso
- **CursoHero** - Seção destaque do curso
  - Status: ✅ Funcionando
  - Recursos: Título, badge, descrição, preço

- **CursoModulos** - Lista de módulos e tópicos
  - Status: ✅ Funcionando
  - Recursos: Acordeão com módulos/tópicos

- **CursoAprendizados** - O que você vai aprender
  - Status: ✅ Funcionando
  - Recursos: Lista de objetivos

- **CursoCTA** - Call-to-action (Comprar/Acessar)
  - Status: ✅ Funcionando
  - Recursos: Botão de ação, preço, garantia

---

## 6. BIBLIOTECAS (lib/)

### Autenticação & Banco de Dados
- **supabase/server.ts** - Cliente Supabase para Server Components
  - Status: ✅ Funcionando
  - Funcionalidade: Autenticação, queries, mutations

- **supabase/client.ts** - Cliente Supabase para Client Components
  - Status: ✅ Funcionando
  - Funcionalidade: Autenticação, queries no frontend

- **supabase/middleware.ts** - Middleware de autenticação
  - Status: ✅ Funcionando
  - Funcionalidade: Protege rotas, valida tokens

### Dados & Busca
- **cursos-data.ts** - Funções para buscar cursos
  - Status: ✅ Funcionando
  - Funcionalidade: getCursos, getCursoBySlug, getCursoSlugs

- **search-synonyms.ts** - Sinônimos para busca melhorada
  - Status: ✅ Funcionando
  - Funcionalidade: "Troca de tela" = "bateria" etc

### Notificações
- **telegram.ts** - Cliente Telegram unificado
  - Status: ✅ Funcionando
  - Funcionalidade: sendMessage, notifyVenda, notifyContact, notifySignup, notifyError

- **telegram/commands.ts** - Router de comandos Telegram
  - Status: 🔄 Implementado
  - Funcionalidade: Roteia /dashboard, /vendas, etc para handlers

- **telegram/handlers/** - Handlers de comandos Telegram
  - **dashboard.ts** - Overview de vendas/alunos
  - **vendas.ts** - Últimas vendas
  - **alunos.ts** - Lista de alunos
  - **cursos.ts** - Lista de cursos
  - **mensagens.ts** - Mensagens de contato

### Integrações
- **cakto/client.ts** - Cliente para Cakto
  - Status: ❌ Não está em uso (Kiwify é a atual)
  - Pode remover

- **error-handler.ts** - Captura erros globais e envia Telegram
  - Status: ✅ Funcionando
  - Funcionalidade: Notifica admin de erros não tratados

### Utilitários
- **utils.ts** - Funções auxiliares gerais
  - Status: ✅ Funcionando
  - Funcionalidade: cn(), formatadores, etc

---

## 7. DEPENDÊNCIAS

### Framework & Build
- **next** - Framework React (v16.2.6)
  - Necessário: SIM
- **react, react-dom** - Biblioteca React
  - Necessário: SIM
- **typescript** - Tipagem (dev)
  - Necessário: SIM
- **tailwindcss, postcss, autoprefixer** - Estilos
  - Necessário: SIM

### UI Components
- **@radix-ui/** - 28 componentes de UI (accordion, dialog, etc)
  - Necessário: SIM - base de toda a interface
- **lucide-react** - Ícones
  - Necessário: SIM

### Autenticação & Banco
- **@supabase/supabase-js** - Cliente Supabase
  - Necessário: SIM
- **@supabase/ssr** - SSR adapter para Supabase
  - Necessário: SIM

### Formulários & Validação
- **react-hook-form** - Gerenciamento de formulários
  - Necessário: SIM
- **@hookform/resolvers** - Resolvers para validação
  - Necessário: SIM
- **zod** - Validação de schemas
  - Necessário: SIM

### Data & Horários
- **date-fns** - Manipulação de datas
  - Necessário: SIM (notificações, timestamps)
- **recharts** - Gráficos
  - Necessário: TALVEZ (apenas admin usa)

### Carrosséis
- **embla-carousel-react** - Carrossel (depoimentos)
  - Necessário: SIM

### IA & API
- **ai** - AI SDK da Vercel (v6.0.185)
  - Necessário: SIM (gerador de cursos)
- **axios** - HTTP client
  - Necessário: SIM (Telegram, Cakto)

### Utilitários
- **class-variance-authority** - Variantes de componentes
  - Necessário: SIM
- **clsx, tailwind-merge** - Utilitários de classe
  - Necessário: SIM
- **next-themes** - Tema (dark/light)
  - Necessário: TALVEZ
- **sonner** - Notificações toast
  - Necessário: SIM
- **cmdk** - Command palette
  - Necessário: TALVEZ (apenas busca usa)
- **vaul** - Drawer component
  - Necessário: TALVEZ
- **input-otp** - Input de OTP
  - Necessário: TALVEZ (se implementar 2FA)
- **react-resizable-panels** - Painéis redimensionáveis
  - Necessário: TALVEZ (admin não usa ainda)
- **react-day-picker** - Date picker
  - Necessário: TALVEZ

### Análise
- **@vercel/analytics** - Analytics
  - Necessário: SIM
- **@vercel/speed-insights** - Performance monitoring
  - Necessário: SIM

---

## 8. BANCO DE DADOS (Supabase)

### Tabelas Ativas
- **cursos** - Catálogo de cursos
- **modules** - Módulos de cada curso
- **lessons** - Tópicos dentro de módulos
- **purchases** - Histórico de compras
- **profiles** - Dados dos usuários
- **mensagens** - Mensagens de contato
- **webhook_logs** - Log de webhooks
- **config** - Configurações do site

### Tabelas Novas (Telegram)
- **telegram_admins** - Admins autorizados no bot
- **telegram_logs** - Histórico de comandos executados

---

## 9. STATUS & RESUMO

### ✅ PRONTO & FUNCIONANDO
- Homepage completa
- Página de cursos e detalhe
- Formulário de contato
- Busca com autocomplete
- Webhooks de pagamento (Kiwify)
- Notificações básicas (Telegram)
- Páginas legais (Termos, Privacidade, Reembolso)
- Design responsivo (mobile first)

### ⚠️ PRONTO MAS INCOMPLETO
- Painel de admin (estrutura pronta, dados mockados)
- Painel de aluno (estrutura pronta, sem integração)
- Bot Telegram (código pronto, webhook não registrado)
- IA Generator (funciona, lento)
- Login (formulário pronto, sem autenticação real)

### ❌ NÃO ESTÁ EM USO / PODE REMOVER
- `/api/cakto/create-product` - Cakto descontinuado
- `/api/webhooks/cakto/webhook` - Cakto descontinuado
- `lib/cakto/client.ts` - Cakto descontinuado
- Componentes de Cakto (se existirem)

### 🔄 IMPLEMENTAÇÃO EM PROGRESSO
- Sistema Telegram completo (aguardando registro webhook)
- Integração de autenticação real

---

## 10. PRÓXIMAS ETAPAS RECOMENDADAS

1. **Registrar webhook Telegram** - Fazer bot funcionar com comandos
2. **Implementar autenticação real** - Login/signup funcional
3. **Conectar painel admin** - Usar dados reais do Supabase
4. **Remover Cakto** - Limpar código não usado
5. **Otimizar IA Generator** - Melhorar performance
6. **Implementar streaming de vídeos** - Para alunos assistirem aulas
7. **Certificados automáticos** - Gerar após conclusão

