/**
 * Master Module Types
 * Centralized management types for multi-tenant SaaS
 */

export interface Tenant {
  id: string
  slug: string
  name: string
  email: string
  logo?: string
  status: 'active' | 'inactive' | 'trial' | 'suspended'
  planId: string
  databaseUrl?: string
  trialEndsAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Plan {
  id: string
  slug: string
  name: string
  description?: string
  price: number
  billingPeriod: 'monthly' | 'yearly'
  maxUsers: number
  maxProjects: number
  features: string[]
  status: 'active' | 'deprecated'
  createdAt: Date
  updatedAt: Date
}

export interface FeatureFlag {
  id: string
  slug: string
  name: string
  description?: string
  module: string
  planIds: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  tenantId: string
  planId: string
  status: 'active' | 'canceled' | 'expired'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MasterUser {
  id: string
  email: string
  name?: string
  role: 'super_admin' | 'admin' | 'support'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
