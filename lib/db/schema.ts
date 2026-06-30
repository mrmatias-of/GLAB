import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
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
