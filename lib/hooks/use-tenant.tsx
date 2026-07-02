'use client'

import { createContext, useContext, ReactNode, useMemo } from 'react'
import { TenantConfig } from '../tenant'

interface TenantContextType {
  tenant: TenantConfig | null
  isLoading: boolean
  error: string | null
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({
  children,
  tenant,
  isLoading = false,
  error = null,
}: {
  children: ReactNode
  tenant: TenantConfig | null
  isLoading?: boolean
  error?: string | null
}) {
  const value = useMemo(
    () => ({
      tenant,
      isLoading,
      error,
    }),
    [tenant, isLoading, error]
  )

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

/**
 * Hook para acessar informações do tenant atual
 * Deve ser usado dentro de TenantProvider
 */
export function useTenant() {
  const context = useContext(TenantContext)

  if (context === undefined) {
    throw new Error('useTenant must be used within TenantProvider')
  }

  return context
}

/**
 * Hook para acessar cores/branding do tenant
 */
export function useTenantBranding() {
  const { tenant } = useTenant()

  if (!tenant?.branding) {
    return {
      primaryColor: '#3B82F6',
      secondaryColor: '#06B6D4',
      accentColor: '#10B981',
      backgroundColor: '#0B0F19',
      textColor: '#F1F5F9',
      theme: 'dark',
      logoUrl: undefined,
      favicon: undefined,
    }
  }

  return tenant.branding
}

/**
 * Hook para acessar CSS variables do tenant
 * Retorna um objeto com cores customizadas
 */
export function useTenantTheme() {
  const branding = useTenantBranding()

  return {
    '--tenant-primary': branding.primaryColor,
    '--tenant-secondary': branding.secondaryColor,
    '--tenant-accent': branding.accentColor,
    '--tenant-bg': branding.backgroundColor,
    '--tenant-text': branding.textColor,
  } as React.CSSProperties
}
