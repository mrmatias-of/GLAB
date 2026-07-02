'use client'

import { createContext, useContext, ReactNode } from 'react'

export interface TenantContextType {
  tenantId: string
  tenantSlug: string
  tenantName: string
  isReady: boolean
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({
  children,
  tenantId,
  tenantSlug,
  tenantName,
}: {
  children: ReactNode
  tenantId: string
  tenantSlug: string
  tenantName: string
}) {
  return (
    <TenantContext.Provider
      value={{
        tenantId,
        tenantSlug,
        tenantName,
        isReady: !!tenantId,
      }}
    >
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

export function useTenantId() {
  return useTenant().tenantId
}

export function useTenantSlug() {
  return useTenant().tenantSlug
}
