/**
 * Master Module Types
 */

export interface Tenant {
  id: string
  slug: string
  name: string
  email: string
  status: 'trial' | 'active' | 'suspended' | 'deleted'
  planId: string
  storageUsed: number
  maxStorage: number
  usersCount: number
  createdAt: Date
  trialEndsAt?: Date
  deletedAt?: Date
}

export interface Plan {
  id: string
  name: string
  price: number
  billingCycle: 'monthly' | 'yearly'
  maxUsers: number
  maxStorage: number
  features: string[]
}

export interface FeatureFlag {
  id: string
  name: string
  key: string
  planIds: string[]
  enabled: boolean
}

export interface TenantStats {
  totalTenants: number
  activeTenants: number
  trialTenants: number
  totalRevenue: number
  churnRate: number
}
