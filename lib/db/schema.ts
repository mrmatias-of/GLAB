import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

// =============================================================================
// TENANT DATABASE SCHEMA - Per-tenant isolated data
// Each tenant has its own PostgreSQL database/schema
// =============================================================================

// --- Tenant Context ---

// NOTE: tenantId is set at connection time via environment or passed via middleware
// All tenant tables include tenantId for logical isolation + queryfiltering

// --- Better Auth required tables (Tenant-specific) ---
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  tenantId: text('tenantId').notNull(), // Tenant isolation
  name: text('name').notNull(),
  email: text('email').notNull(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Add unique constraint per tenant
// CREATE UNIQUE INDEX idx_user_email_per_tenant ON "user"(tenantId, email);

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  tenantId: text('tenantId').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  tenantId: text('tenantId').notNull(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
import { serial, integer, decimal, varchar } from "drizzle-orm/pg-core"

// --- Assistência Técnica Tables ---

export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  nome: text("nome").notNull(),
  email: text("email"),
  telefone: text("telefone"),
  cpf_cnpj: text("cpf_cnpj").unique(),
  endereco: text("endereco"),
  cidade: text("cidade"),
  estado: text("estado"),
  cep: text("cep"),
  observacoes: text("observacoes"),
  ativo: boolean("ativo").notNull().default(true),
  valor_acumulado: decimal("valor_acumulado", { precision: 12, scale: 2 }).default("0"),
  satisfacao: integer("satisfacao"), // 1-5
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const tecnicos = pgTable("tecnicos", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  nome: text("nome").notNull(),
  email: text("email"),
  telefone: text("telefone"),
  cpf: text("cpf").unique(),
  especialidade: text("especialidade"), // Celular, Notebook, Impressora, etc
  status: varchar("status", { length: 20 }).default("ativo"), // ativo, inativo, ferias
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  comissao_percentual: decimal("comissao_percentual", { precision: 5, scale: 2 }).default("10"),
  os_concluidas: integer("os_concluidas").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const ordens_servico = pgTable("ordens_servico", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  numero: varchar("numero", { length: 20 }).unique().notNull(),
  cliente_id: integer("cliente_id"),
  tecnico_id: integer("tecnico_id"),
  descricao: text("descricao").notNull(),
  equipamento: text("equipamento"),
  numero_serie: text("numero_serie"),
  prioridade: varchar("prioridade", { length: 20 }).default("normal"), // alta, normal, baixa
  status: varchar("status", { length: 20 }).default("aberto"), // aberto, em_progresso, pausado, finalizado, cancelado
  data_abertura: timestamp("data_abertura").notNull().defaultNow(),
  data_prevista: timestamp("data_prevista"),
  data_conclusao: timestamp("data_conclusao"),
  tempo_estimado_horas: decimal("tempo_estimado_horas", { precision: 8, scale: 2 }),
  tempo_real_horas: decimal("tempo_real_horas", { precision: 8, scale: 2 }),
  valor_orcado: decimal("valor_orcado", { precision: 12, scale: 2 }),
  valor_final: decimal("valor_final", { precision: 12, scale: 2 }),
  status_orcamento: varchar("status_orcamento", { length: 20 }), // aprovado, recusado, alterado
  observacoes: text("observacoes"),
  garantia_meses: integer("garantia_meses"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const servicos = pgTable("servicos", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  valor_padrao: decimal("valor_padrao", { precision: 12, scale: 2 }).notNull(),
  tempo_medio_horas: decimal("tempo_medio_horas", { precision: 8, scale: 2 }),
  categoria: text("categoria"),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const itens_os = pgTable("itens_os", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  os_id: integer("os_id").notNull(),
  servico_id: integer("servico_id"),
  descricao: text("descricao").notNull(),
  quantidade: decimal("quantidade", { precision: 10, scale: 2 }).notNull(),
  valor_unitario: decimal("valor_unitario", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// --- MULTI-TENANT MASTER TABLES (Central Database) ---

export const tenants = pgTable("tenants", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  databaseUrl: text("databaseUrl").notNull(),
  databaseName: text("databaseName").notNull(),
  ownerUserId: text("ownerUserId").notNull(),
  plan: varchar("plan", { length: 50 }).default("free"), // free, pro, enterprise
  status: varchar("status", { length: 20 }).default("active"), // active, suspended, deleted
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  deletedAt: timestamp("deletedAt"),
})

export const tenantMembers = pgTable("tenantMembers", {
  id: text("id").primaryKey(),
  tenantId: text("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).default("member"), // owner, admin, member
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const tenantBranding = pgTable("tenantBranding", {
  id: text("id").primaryKey(),
  tenantId: text("tenantId").notNull().unique().references(() => tenants.id, { onDelete: "cascade" }),
  logoUrl: text("logoUrl"),
  primaryColor: varchar("primaryColor", { length: 7 }).default("#3B82F6"), // Blue
  secondaryColor: varchar("secondaryColor", { length: 7 }).default("#06B6D4"), // Cyan
  accentColor: varchar("accentColor", { length: 7 }).default("#10B981"), // Green
  backgroundColor: varchar("backgroundColor", { length: 7 }).default("#0B0F19"), // Navy
  textColor: varchar("textColor", { length: 7 }).default("#F1F5F9"), // Light
  theme: varchar("theme", { length: 20 }).default("dark"), // dark, light
  favicon: text("favicon"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const tenantPlans = pgTable("tenantPlans", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  billingCycle: varchar("billingCycle", { length: 20 }).default("monthly"), // monthly, yearly
  maxUsers: integer("maxUsers"),
  maxClients: integer("maxClients"),
  maxServiceOrders: integer("maxServiceOrders"),
  features: text("features"), // JSON array of features
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const tenantSubscriptions = pgTable("tenantSubscriptions", {
  id: text("id").primaryKey(),
  tenantId: text("tenantId").notNull().unique().references(() => tenants.id, { onDelete: "cascade" }),
  planId: text("planId").notNull().references(() => tenantPlans.id),
  stripeSubscriptionId: text("stripeSubscriptionId"),
  status: varchar("status", { length: 20 }).default("active"), // active, canceled, past_due
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const estoque = pgTable("estoque", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  categoria: text("categoria"),
  quantidade_atual: decimal("quantidade_atual", { precision: 10, scale: 2 }).notNull().default("0"),
  quantidade_minima: decimal("quantidade_minima", { precision: 10, scale: 2 }).default("5"),
  valor_unitario: decimal("valor_unitario", { precision: 12, scale: 2 }).notNull(),
  localizacao: text("localizacao"), // Prateleira A1, etc
  garantia_meses: integer("garantia_meses"),
  data_garantia: timestamp("data_garantia"),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const movimentacao_estoque = pgTable("movimentacao_estoque", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  estoque_id: integer("estoque_id").notNull(),
  os_id: integer("os_id"),
  tipo: varchar("tipo", { length: 20 }).notNull(), // entrada, saida, ajuste
  quantidade: decimal("quantidade", { precision: 10, scale: 2 }).notNull(),
  motivo: text("motivo"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const financeiro = pgTable("financeiro", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  os_id: integer("os_id"),
  tecnico_id: integer("tecnico_id"),
  tipo: varchar("tipo", { length: 20 }).notNull(), // receita, despesa, comissao
  descricao: text("descricao").notNull(),
  valor: decimal("valor", { precision: 12, scale: 2 }).notNull(),
  categoria: text("categoria"),
  status: varchar("status", { length: 20 }).default("pendente"), // pendente, pago, atrasado
  data_vencimento: timestamp("data_vencimento"),
  data_pagamento: timestamp("data_pagamento"),
  forma_pagamento: text("forma_pagamento"), // dinheiro, credito, debito, transferencia
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const alocacao_tecnicos = pgTable("alocacao_tecnicos", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  os_id: integer("os_id").notNull(),
  tecnico_id: integer("tecnico_id").notNull(),
  horas_alocadas: decimal("horas_alocadas", { precision: 8, scale: 2 }),
  data_alocacao: timestamp("data_alocacao").notNull().defaultNow(),
})

// --- RH Tables (Recursos Humanos) ---

export const funcionarios = pgTable("funcionarios", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  cpf: text("cpf").notNull().unique(),
  data_nascimento: timestamp("data_nascimento"),
  pis_pasep: text("pis_pasep"),
  banco: text("banco"),
  agencia: text("agencia"),
  conta: text("conta"),
  cargo: text("cargo").notNull(),
  departamento: text("departamento"),
  salario_base: decimal("salario_base", { precision: 12, scale: 2 }).notNull(),
  data_admissao: timestamp("data_admissao").notNull().defaultNow(),
  data_demissao: timestamp("data_demissao"),
  tipo_contrato: varchar("tipo_contrato", { length: 20 }).default("CLT"), // CLT, PJ, Prestador, Estagiário
  regime_jornada: varchar("regime_jornada", { length: 20 }).default("normal"), // normal, turno, integral
  status: varchar("status", { length: 20 }).default("ativo"), // ativo, inativo, demitido, licenca
  telefone: text("telefone"),
  endereco: text("endereco"),
  cidade: text("cidade"),
  estado: text("estado"),
  cep: text("cep"),
  foto_url: text("foto_url"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const contracheques = pgTable("contracheques", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  funcionario_id: integer("funcionario_id").notNull(),
  mes: integer("mes").notNull(), // 1-12
  ano: integer("ano").notNull(),
  data_geracao: timestamp("data_geracao").notNull().defaultNow(),
  
  // Proventos
  salario_base: decimal("salario_base", { precision: 12, scale: 2 }).notNull(),
  horas_extras_50: decimal("horas_extras_50", { precision: 12, scale: 2 }).default("0"),
  horas_extras_100: decimal("horas_extras_100", { precision: 12, scale: 2 }).default("0"),
  adicional_noturno: decimal("adicional_noturno", { precision: 12, scale: 2 }).default("0"),
  adicional_insalubridade: decimal("adicional_insalubridade", { precision: 12, scale: 2 }).default("0"),
  adicional_periculosidade: decimal("adicional_periculosidade", { precision: 12, scale: 2 }).default("0"),
  bônus: decimal("bônus", { precision: 12, scale: 2 }).default("0"),
  comissao: decimal("comissao", { precision: 12, scale: 2 }).default("0"),
  outros_proventos: decimal("outros_proventos", { precision: 12, scale: 2 }).default("0"),
  total_proventos: decimal("total_proventos", { precision: 12, scale: 2 }).notNull(),
  
  // Descontos
  inss: decimal("inss", { precision: 12, scale: 2 }).notNull().default("0"),
  irpf: decimal("irpf", { precision: 12, scale: 2 }).notNull().default("0"),
  fgts: decimal("fgts", { precision: 12, scale: 2 }).notNull().default("0"),
  sindicato: decimal("sindicato", { precision: 12, scale: 2 }).default("0"),
  adiantamento: decimal("adiantamento", { precision: 12, scale: 2 }).default("0"),
  outros_descontos: decimal("outros_descontos", { precision: 12, scale: 2 }).default("0"),
  total_descontos: decimal("total_descontos", { precision: 12, scale: 2 }).notNull(),
  
  // Líquido
  valor_liquido: decimal("valor_liquido", { precision: 12, scale: 2 }).notNull(),
  
  // Meta dados
  status_pagamento: varchar("status_pagamento", { length: 20 }).default("pendente"), // pendente, pago, processando
  data_pagamento: timestamp("data_pagamento"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const eventos_folha = pgTable("eventos_folha", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  funcionario_id: integer("funcionario_id").notNull(),
  tipo_evento: varchar("tipo_evento", { length: 50 }).notNull(), // falta, atraso, hora_extra, adiantamento, etc
  descricao: text("descricao"),
  data_evento: timestamp("data_evento").notNull(),
  mes_referencia: integer("mes_referencia").notNull(),
  ano_referencia: integer("ano_referencia").notNull(),
  valor: decimal("valor", { precision: 12, scale: 2 }),
  horas: decimal("horas", { precision: 8, scale: 2 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const config_impostos = pgTable("config_impostos", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  ano: integer("ano").notNull(),
  
  // INSS (contribuição previdenciária) - faixas progressivas
  inss_aliquota_base: decimal("inss_aliquota_base", { precision: 5, scale: 2 }).default("8.00"), // 8% padrão
  inss_maximo_mensal: decimal("inss_maximo_mensal", { precision: 12, scale: 2 }).default("1751.15"),
  inss_aliquota_2: decimal("inss_aliquota_2", { precision: 5, scale: 2 }).default("9.00"),
  inss_aliquota_3: decimal("inss_aliquota_3", { precision: 5, scale: 2 }).default("11.00"),
  inss_aliquota_4: decimal("inss_aliquota_4", { precision: 5, scale: 2 }).default("12.00"),
  
  // IRPF (imposto de renda) - faixas progressivas
  irpf_faixa_1_ate: decimal("irpf_faixa_1_ate", { precision: 12, scale: 2 }).default("2826.65"),
  irpf_faixa_1_aliquota: decimal("irpf_faixa_1_aliquota", { precision: 5, scale: 2 }).default("0.00"),
  irpf_faixa_2_ate: decimal("irpf_faixa_2_ate", { precision: 12, scale: 2 }).default("3751.05"),
  irpf_faixa_2_aliquota: decimal("irpf_faixa_2_aliquota", { precision: 5, scale: 2 }).default("7.50"),
  irpf_faixa_3_ate: decimal("irpf_faixa_3_ate", { precision: 12, scale: 2 }).default("4664.68"),
  irpf_faixa_3_aliquota: decimal("irpf_faixa_3_aliquota", { precision: 5, scale: 2 }).default("15.00"),
  irpf_faixa_4_ate: decimal("irpf_faixa_4_ate", { precision: 12, scale: 2 }).default("5555.48"),
  irpf_faixa_4_aliquota: decimal("irpf_faixa_4_aliquota", { precision: 5, scale: 2 }).default("22.50"),
  irpf_faixa_5_aliquota: decimal("irpf_faixa_5_aliquota", { precision: 5, scale: 2 }).default("27.50"),
  irpf_deducao_faixa_2: decimal("irpf_deducao_faixa_2", { precision: 12, scale: 2 }).default("211.95"),
  irpf_deducao_faixa_3: decimal("irpf_deducao_faixa_3", { precision: 12, scale: 2 }).default("528.94"),
  irpf_deducao_faixa_4: decimal("irpf_deducao_faixa_4", { precision: 12, scale: 2 }).default("990.55"),
  irpf_deducao_faixa_5: decimal("irpf_deducao_faixa_5", { precision: 12, scale: 2 }).default("1613.03"),
  
  // FGTS - Fundo de Garantia do Tempo de Serviço
  fgts_aliquota: decimal("fgts_aliquota", { precision: 5, scale: 2 }).default("8.00"),
  
  // Vale Refeição/Alimentação
  vr_va_aliquota: decimal("vr_va_aliquota", { precision: 5, scale: 2 }).default("20.00"), // desconto do funcionário
  
  // Dependentes para IR
  deducao_dependente: decimal("deducao_dependente", { precision: 12, scale: 2 }).default("189.59"),
  
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const banco_horas = pgTable("banco_horas", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  funcionario_id: integer("funcionario_id").notNull(),
  mes_ano: varchar("mes_ano", { length: 7 }).notNull(), // YYYY-MM
  saldo_anterior: decimal("saldo_anterior", { precision: 8, scale: 2 }).default("0"),
  horas_trabalhadas: decimal("horas_trabalhadas", { precision: 8, scale: 2 }).default("0"),
  horas_devidas: decimal("horas_devidas", { precision: 8, scale: 2 }).default("0"),
  horas_gozadas: decimal("horas_gozadas", { precision: 8, scale: 2 }).default("0"),
  faltas_justificadas: decimal("faltas_justificadas", { precision: 8, scale: 2 }).default("0"),
  faltas_injustificadas: decimal("faltas_injustificadas", { precision: 8, scale: 2 }).default("0"),
  saldo_atual: decimal("saldo_atual", { precision: 8, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const historico_salarial = pgTable("historico_salarial", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  funcionario_id: integer("funcionario_id").notNull(),
  salario_anterior: decimal("salario_anterior", { precision: 12, scale: 2 }).notNull(),
  salario_novo: decimal("salario_novo", { precision: 12, scale: 2 }).notNull(),
  tipo_alteracao: varchar("tipo_alteracao", { length: 50 }).notNull(), // aumento, reducao, promocao, demissao, etc
  motivo: text("motivo"),
  data_vigencia: timestamp("data_vigencia").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// --- Auth Tables ---

export const passwordResets = pgTable("passwordResets", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})
