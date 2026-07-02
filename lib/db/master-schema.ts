import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  decimal,
  varchar,
  jsonb,
  serial,
} from 'drizzle-orm/pg-core'

// =============================================================================
// MASTER DATABASE SCHEMA - Centralized multi-tenant management
// =============================================================================

// --- Master Auth Tables ---

export const master_user = pgTable('master_user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password'),
  role: varchar('role', { length: 20 }).default('user'), // admin, manager, user
  status: varchar('status', { length: 20 }).default('active'), // active, inactive, suspended
  emailVerified: boolean('emailVerified').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const master_session = pgTable('master_session', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => master_user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// --- Tenant Management ---

export const tenants = pgTable('tenants', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(), // empresa-xyz
  name: text('name').notNull(),
  description: text('description'),
  logo_url: text('logo_url'),
  website: text('website'),
  email: text('email').notNull(),
  phone: text('phone'),
  
  // Tenant Configuration
  database_url: text('database_url').notNull(), // Connection string para DB do tenant
  schema_name: text('schema_name').notNull().unique(), // schema público do tenant
  
  // Owner info
  owner_id: text('owner_id')
    .notNull()
    .references(() => master_user.id, { onDelete: 'restrict' }),
  
  // Status
  status: varchar('status', { length: 20 }).default('active'), // active, trial, suspended, inactive
  
  // Dates
  trial_expires_at: timestamp('trial_expires_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// --- Plans & Pricing ---

export const plans = pgTable('plans', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  price_monthly: decimal('price_monthly', { precision: 10, scale: 2 }).default('0'),
  price_yearly: decimal('price_yearly', { precision: 10, scale: 2 }).default('0'),
  billing_period: varchar('billing_period', { length: 20 }).default('monthly'), // monthly, yearly
  
  // Limits
  max_users: integer('max_users').default(5),
  max_storage_gb: integer('max_storage_gb').default(10),
  max_transactions: integer('max_transactions').default(1000),
  
  // Features (JSON)
  features: jsonb('features').default('[]'), // list of feature keys
  
  // Trial
  trial_days: integer('trial_days').default(14),
  
  // Status
  is_active: boolean('is_active').default(true),
  
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// --- Subscriptions ---

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  tenant_id: text('tenant_id')
    .notNull()
    .unique()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  
  plan_id: integer('plan_id')
    .notNull()
    .references(() => plans.id, { onDelete: 'restrict' }),
  
  status: varchar('status', { length: 20 }).default('trial'), // trial, active, cancelled, expired
  
  current_period_start: timestamp('current_period_start').notNull().defaultNow(),
  current_period_end: timestamp('current_period_end'),
  
  trial_started_at: timestamp('trial_started_at'),
  trial_ends_at: timestamp('trial_ends_at'),
  
  auto_renew: boolean('auto_renew').default(true),
  
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  cancelled_at: timestamp('cancelled_at'),
})

// --- Feature Flags ---

export const feature_flags = pgTable('feature_flags', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(), // 'rh_module', 'crm_module', 'marketplace'
  name: text('name').notNull(),
  description: text('description'),
  
  // Availability
  is_global: boolean('is_global').default(false), // available to all tenants
  is_active: boolean('is_active').default(true),
  
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// --- Plan Features (Junction table) ---

export const plan_features = pgTable('plan_features', {
  id: serial('id').primaryKey(),
  plan_id: integer('plan_id')
    .notNull()
    .references(() => plans.id, { onDelete: 'cascade' }),
  
  feature_id: integer('feature_id')
    .notNull()
    .references(() => feature_flags.id, { onDelete: 'cascade' }),
  
  created_at: timestamp('created_at').notNull().defaultNow(),
})

// --- Tenant Feature Overrides ---

export const tenant_features = pgTable('tenant_features', {
  id: serial('id').primaryKey(),
  tenant_id: text('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  
  feature_id: integer('feature_id')
    .notNull()
    .references(() => feature_flags.id, { onDelete: 'cascade' }),
  
  is_enabled: boolean('is_enabled').default(true),
  enabled_at: timestamp('enabled_at'),
  disabled_at: timestamp('disabled_at'),
  
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// --- Tenant Members ---

export const tenant_members = pgTable('tenant_members', {
  id: serial('id').primaryKey(),
  tenant_id: text('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  
  user_id: text('user_id')
    .notNull()
    .references(() => master_user.id, { onDelete: 'cascade' }),
  
  role: varchar('role', { length: 20 }).default('member'), // owner, admin, member
  
  joined_at: timestamp('joined_at').notNull().defaultNow(),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

// --- Payments & Invoices ---

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  subscription_id: text('subscription_id')
    .notNull()
    .references(() => subscriptions.id, { onDelete: 'cascade' }),
  
  tenant_id: text('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('BRL'),
  
  status: varchar('status', { length: 20 }).default('draft'), // draft, issued, paid, failed, refunded
  
  issue_date: timestamp('issue_date'),
  due_date: timestamp('due_date'),
  paid_date: timestamp('paid_date'),
  
  description: text('description'),
  
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// --- Audit Log ---

export const audit_log = pgTable('audit_log', {
  id: text('id').primaryKey(),
  
  tenant_id: text('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  user_id: text('user_id'),
  
  action: text('action').notNull(), // 'create', 'update', 'delete', 'login', etc
  entity_type: text('entity_type').notNull(), // 'tenant', 'subscription', 'user'
  entity_id: text('entity_id'),
  
  changes: jsonb('changes'), // old_value and new_value
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  
  created_at: timestamp('created_at').notNull().defaultNow(),
})

// --- API Keys (for integrations) ---

export const api_keys = pgTable('api_keys', {
  id: text('id').primaryKey(),
  tenant_id: text('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  
  name: text('name').notNull(),
  key_hash: text('key_hash').notNull(),
  last_used_at: timestamp('last_used_at'),
  
  is_active: boolean('is_active').default(true),
  
  created_at: timestamp('created_at').notNull().defaultNow(),
  revoked_at: timestamp('revoked_at'),
})

// --- Webhooks ---

export const webhooks = pgTable('webhooks', {
  id: text('id').primaryKey(),
  tenant_id: text('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  
  event_type: text('event_type').notNull(), // 'subscription.created', 'invoice.paid', etc
  url: text('url').notNull(),
  
  is_active: boolean('is_active').default(true),
  secret: text('secret').notNull(),
  
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})
