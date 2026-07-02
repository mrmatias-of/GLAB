# GUIA COMPLETO - 53 ROTAS DE API

## Índice

1. [Resumo Executivo](#resumo-executivo)
2. [Organização por Módulo](#organização-por-módulo)
3. [Rotas Críticas (Priority 1)](#rotas-críticas)
4. [Rotas de Alto Impacto (Priority 2)](#rotas-de-alto-impacto)
5. [Rotas Auxiliares (Priority 3)](#rotas-auxiliares)
6. [Status de Migração](#status-de-migração)

---

## Resumo Executivo

**Total:** 53 rotas de API  
**Módulos:** 18 domínios  
**HTTP Methods:** GET, POST, PUT, DELETE, PATCH  
**Métodos mais usados:** GET (32), POST (19), PUT (8), DELETE (8)  

### Distribuição por Tipo

| Tipo | Rotas | % |
|------|-------|---|
| Listagem (GET) | 32 | 60% |
| Criação (POST) | 19 | 36% |
| Atualização (PUT) | 8 | 15% |
| Deleção (DELETE) | 8 | 15% |
| **Total** | **53** | **100%** |

---

## Organização por Módulo

### 📦 AUTENTICAÇÃO (auth) - 7 rotas

```
POST   /auth/signin
POST   /auth/signup
POST   /auth/reset-password
POST   /auth/confirm-reset-password
POST   /auth/logout
POST   /auth/activity
GET    /auth/[...all]  (catch-all para Better Auth)
```

**Status:** Complexo - gerenciado por Better Auth  
**Prioridade:** P1 (crítica)  
**Dependências:** Session management  
**Middleware necessário:** Rate limiting específico para login  

---

### 📦 CLIENTES (CRM) - 2 rotas

```
GET    /clientes
POST   /clientes
GET    /clientes/[id]
PUT    /clientes/[id]
DELETE /clientes/[id]
```

**Status:** 2/5 migradas (40%)  
**Prioridade:** P1 (crítica)  
**Serviço:** ClienteService  
**Modelo:** Cliente (CRM)  

---

### 📦 ESTOQUE - 5 rotas

```
GET    /estoque
POST   /estoque
GET    /estoque/[id]
PUT    /estoque/[id]
DELETE /estoque/[id]
GET    /estoque/movimentacoes
POST   /estoque/movimentacoes
```

**Status:** 0% migradas  
**Prioridade:** P1 (crítica)  
**Serviço:** EstoqueService  
**Modelo:** Produto, Movimentação  
**Funcionalidade especial:** Rastreamento de movimentações de estoque

---

### 📦 ORDENS DE SERVIÇO - 2 rotas

```
GET    /ordens-servico
POST   /ordens-servico
GET    /ordens-servico/[id]
PUT    /ordens-servico/[id]
DELETE /ordens-servico/[id]
```

**Status:** 0% migradas  
**Prioridade:** P1 (crítica)  
**Serviço:** OrdemService  
**Modelo:** Ordem de Serviço  
**Workflow:** Criação → Atribuição → Execução → Faturamento

---

### 📦 FINANCEIRO - 7 rotas

```
GET    /financeiro
POST   /financeiro
GET    /financeiro/[id]
PUT    /financeiro/[id]
DELETE /financeiro/[id]
GET    /financeiro/resumo
GET    /financeiro/contas-receber
GET    /financeiro/contas-pagar
GET    /financeiro/cash-flow
GET    /financeiro/commissions
```

**Status:** 0% migradas  
**Prioridade:** P1 (crítica)  
**Serviço:** FinanceiroService  
**Modelos:** Fatura, ContaReceber, ContaPagar, Comissão  
**Relatórios:** Cash flow, comissões, análise de contas

---

### 📦 RH (Human Resources) - 8 rotas

```
GET    /rh/funcionarios
POST   /rh/funcionarios
GET    /rh/funcionarios/[id]
PUT    /rh/funcionarios/[id]
DELETE /rh/funcionarios/[id]
GET    /rh/banco-horas
POST   /rh/banco-horas
GET    /rh/historico-salarial
POST   /rh/historico-salarial
GET    /rh/contracheques
POST   /rh/contracheques
GET    /rh/config-impostos
POST   /rh/config-impostos
GET    /rh/eventos-folha
POST   /rh/eventos-folha
POST   /rh/gerar-folha-pagamento
```

**Status:** 0% migradas  
**Prioridade:** P2 (alta)  
**Serviço:** RHService  
**Modelos:** Funcionário, BancoHoras, Contracheque, ConfigImpostos  
**Funcionalidade:** Folha de pagamento, banco de horas, contracheques

---

### 📦 DASHBOARD - 6 rotas

```
GET    /dashboard/metrics
GET    /dashboard/charts
GET    /dashboard/revenue
GET    /dashboard/monthly-trend
GET    /dashboard/orders-status
GET    /dashboard/technician-performance
```

**Status:** 0% migradas  
**Prioridade:** P2 (alta)  
**Tipo:** Read-only analytics  
**Padrão:** Apenas GET, sem estado  
**Performance:** Requer cache/revalidate

---

### 📦 COMISSÕES - 2 rotas

```
GET    /comissoes
POST   /comissoes/registrar
```

**Status:** 0% migradas  
**Prioridade:** P2 (alta)  
**Serviço:** ComissoesService  
**Dependência:** Dados de vendas/ordens

---

### 📦 SERVIÇOS - 2 rotas

```
GET    /servicos
POST   /servicos
GET    /servicos/[id]
PUT    /servicos/[id]
DELETE /servicos/[id]
```

**Status:** 0% migradas  
**Prioridade:** P2 (média)  
**Modelo:** Serviço (catálogo)  
**Uso:** Definição de serviços oferecidos

---

### 📦 TÉCNICOS - 2 rotas

```
GET    /tecnicos
POST   /tecnicos
GET    /tecnicos/[id]
PUT    /tecnicos/[id]
DELETE /tecnicos/[id]
```

**Status:** 0% migradas  
**Prioridade:** P2 (média)  
**Modelo:** Técnico (usuário com role específico)

---

### 📦 ROTEAMENTO - 1 rota

```
GET    /roteamento
POST   /roteamento
```

**Status:** 0% migradas  
**Prioridade:** P2 (média)  
**Funcionalidade:** Otimização de rota para técnicos  
**Integração:** Possivelmente geolocation

---

### 📦 RELATÓRIOS - 1 rota

```
GET    /relatorios
```

**Status:** 0% migradas  
**Prioridade:** P2 (média)  
**Tipo:** Read-only  
**Formato:** Relatórios consolidados por período

---

### 📦 ORDENS INTERNAS - 1 rota

```
GET    /ordens
GET    /ordens/[id]
```

**Status:** 0% migradas  
**Prioridade:** P3 (baixa)  
**Tipo:** Read-only  
**Modelo:** Ordem (diferente de ordem de serviço)

---

### 📦 UTILITÁRIOS & INTEGRAÇÕES

#### Upload - 1 rota
```
POST   /upload
```
**Status:** 0% migradas  
**Prioridade:** P3 (auxiliar)  
**Tipo:** File upload  
**Uso:** Documentos, anexos

#### OCR - 1 rota
```
POST   /ocr
```
**Status:** 0% migradas  
**Prioridade:** P3 (auxiliar)  
**Tipo:** Processamento de imagem  
**Uso:** Leitura de documentos

#### Geolocation - 1 rota
```
GET    /geolocation
POST   /geolocation
```
**Status:** 0% migradas  
**Prioridade:** P3 (auxiliar)  
**Tipo:** Localização GPS  
**Uso:** Rastreamento de técnicos

#### Notificações - 1 rota
```
POST   /notificacoes
```
**Status:** 0% migradas  
**Prioridade:** P3 (auxiliar)  
**Tipo:** Envio de notificações  
**Canais:** Email, SMS, push

#### Tracking - 1 rota
```
POST   /track
```
**Status:** 0% migradas  
**Prioridade:** P3 (auxiliar)  
**Tipo:** Analytics/telemetria  
**Uso:** Rastreamento de eventos

#### Validação de Equipamento - 1 rota
```
POST   /validate-equipment
```
**Status:** 0% migradas  
**Prioridade:** P3 (auxiliar)  
**Tipo:** Validação  
**Uso:** Verificação de dados de equipamento

#### Contact - 1 rota
```
POST   /contact
```
**Status:** 0% migradas  
**Prioridade:** P3 (auxiliar)  
**Tipo:** Formulário de contato  
**Uso:** Website/landing page

#### Feature Flags - 1 rota
```
GET    /master/feature-flags
POST   /master/feature-flags
```
**Status:** 0% migradas  
**Prioridade:** P3 (auxiliar)  
**Tipo:** Configuração  
**Uso:** Controle de features

---

## Rotas Críticas (Priority 1)

Essas 22 rotas são o coração da aplicação e devem ser migradas PRIMEIRO.

### Bloco 1: Autenticação (7 rotas)
- Gerencia acesso ao sistema
- Rate limiting especial para login (10 tentativas/15min)
- Integrada com Better Auth
- **Padrão:** POST com body

### Bloco 2: CRM - Clientes (2 rotas)
- CRUD completo de clientes
- Base para vendas/serviços
- **Status:** Já 40% migrada
- **Próximo:** Completar integração

### Bloco 3: Estoque (3 rotas)
- Gerenciamento de inventário
- Movimentações rastreadas
- Requer transações de banco de dados
- **Crítico para:** Negócio, reembalagem, devoluções

### Bloco 4: Ordens de Serviço (2 rotas)
- Core da operação
- Workflow: criar → atribuir → executar → faturar
- Integração com RH, Financeiro, Técnicos
- **Crítico para:** Faturamento

### Bloco 5: Financeiro (7 rotas)
- Faturamento, pagamentos, comissões
- Relatórios financeiros
- Integração com Contabilidade
- **Crítico para:** Gestão financeira

---

## Rotas de Alto Impacto (Priority 2)

18 rotas que suportam processos importantes mas não bloqueiam operações.

### Dashboard (6 rotas)
- Metricas e relatórios
- Apenas leitura
- Padrão: GET com cache
- **Impacto:** Visibilidade executiva

### RH (8 rotas)
- Folha de pagamento
- Banco de horas
- Contracheques
- **Impacto:** Gestão de pessoal

### Comissões (2 rotas)
- Cálculo de comissões
- **Impacto:** Motivação de vendedores

### Outros (2 rotas)
- Roteamento, Relatórios
- **Impacto:** Operacional

---

## Rotas Auxiliares (Priority 3)

13 rotas que suportam funcionalidades secundárias.

- Upload, OCR, Geolocation
- Notificações, Tracking
- Validação de equipamento
- Contact form, Feature flags
- **Impacto:** Experiência e tooling

---

## Status de Migração

### Resumo por Etapa

| Etapa | Rotas | Status |
|-------|-------|--------|
| **Migradas** | 2 | ✓ Completas |
| **Em Progresso** | - | - |
| **Pendentes** | 51 | 🔄 A fazer |

### Cronograma Sugerido

**Semana 1: Priority 1 + 2 (22 rotas)**
- Dias 1-2: Autenticação (7 rotas)
- Dias 3-4: CRM + Estoque (5 rotas)
- Dias 5: Financeiro (7 rotas)
- Dia 5+: RH (8 rotas)

**Semana 2: Priority 2 + 3 (29 rotas)**
- Dias 1-2: Dashboard + Comissões (8 rotas)
- Dias 3-5: Utilitários + Auxiliares (21 rotas)

---

## Como Usar Este Documento

1. **Para desenvolvimento:** Consulte a seção do módulo que está trabalhando
2. **Para priorização:** Use o sistema de Priority (P1, P2, P3)
3. **Para tracking:** Atualize o status em cada seção
4. **Para implementação:** Use o template em `ROUTE_TEMPLATE.md`

---

**Última atualização:** Phase 2 - Baseline  
**Próxima revisão:** Após 50% das rotas migradas
