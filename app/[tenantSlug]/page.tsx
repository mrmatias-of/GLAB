'use client'

import { useTenant, useTenantBranding } from '@/lib/hooks/use-tenant'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function TenantDashboard() {
  const { tenant, isLoading, error } = useTenant()
  const branding = useTenantBranding()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error || !tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100">Erro ao carregar tenant</h1>
          <p className="text-slate-400 mt-2">{error || 'Tenant não encontrado'}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: branding.backgroundColor }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: `${branding.primaryColor}33` }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {branding.logoUrl && (
              <div className="w-10 h-10 relative">
                <Image
                  src={branding.logoUrl}
                  alt={tenant.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold" style={{ color: branding.textColor }}>
                {tenant.name}
              </h1>
              <p style={{ color: branding.accentColor }} className="text-sm">
                {tenant.plan.toUpperCase()} Plan
              </p>
            </div>
          </div>
          <div style={{ color: branding.textColor }} className="text-sm">
            Welcome back!
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card Template 1 */}
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: `${branding.primaryColor}0a`,
              borderColor: `${branding.primaryColor}33`,
            }}
          >
            <h3 style={{ color: branding.primaryColor }} className="font-semibold mb-2">
              Dashboard
            </h3>
            <p style={{ color: branding.textColor }} className="opacity-75 text-sm">
              Visualize suas métricas e dados
            </p>
          </div>

          {/* Card Template 2 */}
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: `${branding.secondaryColor}0a`,
              borderColor: `${branding.secondaryColor}33`,
            }}
          >
            <h3 style={{ color: branding.secondaryColor }} className="font-semibold mb-2">
              Configurações
            </h3>
            <p style={{ color: branding.textColor }} className="opacity-75 text-sm">
              Customize seu espaço de trabalho
            </p>
          </div>

          {/* Card Template 3 */}
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: `${branding.accentColor}0a`,
              borderColor: `${branding.accentColor}33`,
            }}
          >
            <h3 style={{ color: branding.accentColor }} className="font-semibold mb-2">
              Suporte
            </h3>
            <p style={{ color: branding.textColor }} className="opacity-75 text-sm">
              Precisa de ajuda? Entre em contato
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: `${branding.primaryColor}05`,
            borderColor: `${branding.primaryColor}1a`,
          }}
        >
          <h2 style={{ color: branding.textColor }} className="text-xl font-bold mb-4">
            Bem-vindo ao {tenant.name}
          </h2>
          <p style={{ color: branding.textColor }} className="opacity-75 leading-relaxed">
            Este é seu espaço dedicado. Aqui você pode gerenciar suas operações, visualizar
            relatórios e configurar tudo do jeito que você gosta. O sistema se adapta ao seu
            estilo com branding personalizado.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              style={{
                backgroundColor: branding.primaryColor,
                color: branding.backgroundColor,
              }}
              className="px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity"
            >
              Explorar Dashboard
            </button>
            <button
              style={{
                color: branding.primaryColor,
                borderColor: branding.primaryColor,
              }}
              className="px-4 py-2 rounded font-medium border hover:opacity-75 transition-opacity"
            >
              Ver Documentação
            </button>
          </div>
        </div>

        {/* Technical Info (for debugging) */}
        <div className="mt-8 p-4 bg-slate-800 rounded text-xs text-slate-300 font-mono">
          <p>Tenant ID: {tenant.id}</p>
          <p>Tenant Slug: {tenant.slug}</p>
          <p>Owner: {tenant.ownerUserId}</p>
          <p>Plan: {tenant.plan}</p>
          <p>Status: {tenant.status}</p>
        </div>
      </main>
    </div>
  )
}
