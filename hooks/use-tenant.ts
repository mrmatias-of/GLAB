'use client'

import { createContext, useContext, ReactNode } from 'react'

export interface Tenant {
  id: string
  slug: string
  name: string
  email: string
  plan: string
  status: string
  branding: {
    logoUrl?: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
    theme: 'dark' | 'light'
    favicon?: string
  }
}

interface TenantContextType {
  tenant: Tenant | null
  isLoading: boolean
  isMasterAdmin: boolean
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({
  children,
  tenant,
  isMasterAdmin,
}: {
  children: ReactNode
  tenant: Tenant | null
  isMasterAdmin: boolean
}) {
  return (
    <TenantContext.Provider value={{ tenant, isLoading: false, isMasterAdmin }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within TenantProvider')
  }
  return context
}
