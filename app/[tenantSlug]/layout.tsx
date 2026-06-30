import { ReactNode } from 'react'
import { getCurrentTenant } from '@/lib/tenant'
import { TenantProvider } from '@/lib/hooks/use-tenant'

interface TenantLayoutProps {
  children: ReactNode
  params: {
    tenantSlug: string
  }
}

export async function generateMetadata({ params }: TenantLayoutProps) {
  const tenant = await getCurrentTenant(params.tenantSlug)

  return {
    title: tenant ? `${tenant.name} - G-LAB` : 'G-LAB',
    description: tenant ? `Dashboard do ${tenant.name}` : 'Dashboard',
  }
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const tenant = await getCurrentTenant(params.tenantSlug)

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100">Tenant Not Found</h1>
          <p className="text-slate-400 mt-2">The requested workspace does not exist.</p>
        </div>
      </div>
    )
  }

  return (
    <html
      lang="pt-BR"
      className="bg-slate-950"
      style={{
        '--tenant-primary': tenant.branding.primaryColor,
        '--tenant-secondary': tenant.branding.secondaryColor,
        '--tenant-accent': tenant.branding.accentColor,
        '--tenant-bg': tenant.branding.backgroundColor,
        '--tenant-text': tenant.branding.textColor,
      } as React.CSSProperties}
    >
      <body className="bg-slate-950">
        <TenantProvider tenant={tenant}>
          {children}
        </TenantProvider>
      </body>
    </html>
  )
}
