'use client'

import { useTenant, useTenantBranding } from '@/lib/hooks/use-tenant'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalClients: number
  totalTechnicians: number
  totalRevenue: number
  avgOrderValue: number
  ordersThisMonth: number
  revenueThisMonth: number
}

export default function TenantDashboard() {
  const { tenant, isLoading, error } = useTenant()
  const branding = useTenantBranding()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/tenant/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data.data)
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setStatsLoading(false)
      }
    }

    if (tenant) {
      fetchStats()
    }
  }, [tenant])

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
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: `${branding.primaryColor}0a`,
              borderColor: `${branding.primaryColor}33`,
            }}
          >
            <h3 style={{ color: branding.primaryColor }} className="font-semibold mb-4 text-sm">
              Total de Ordens
            </h3>
            <p style={{ color: branding.textColor }} className="text-3xl font-bold">
              {statsLoading ? '...' : stats?.totalOrders || 0}
            </p>
            <p style={{ color: branding.textColor }} className="opacity-75 text-xs mt-2">
              {stats?.pendingOrders || 0} pendentes
            </p>
          </div>

          {/* Revenue */}
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: `${branding.secondaryColor}0a`,
              borderColor: `${branding.secondaryColor}33`,
            }}
          >
            <h3 style={{ color: branding.secondaryColor }} className="font-semibold mb-4 text-sm">
              Receita Total
            </h3>
            <p style={{ color: branding.textColor }} className="text-3xl font-bold">
              R$ {statsLoading ? '...' : (stats?.totalRevenue || 0).toLocaleString('pt-BR')}
            </p>
            <p style={{ color: branding.textColor }} className="opacity-75 text-xs mt-2">
              Mês: R$ {statsLoading ? '...' : (stats?.revenueThisMonth || 0).toLocaleString('pt-BR')}
            </p>
          </div>

          {/* Clients */}
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: `${branding.accentColor}0a`,
              borderColor: `${branding.accentColor}33`,
            }}
          >
            <h3 style={{ color: branding.accentColor }} className="font-semibold mb-4 text-sm">
              Total de Clientes
            </h3>
            <p style={{ color: branding.textColor }} className="text-3xl font-bold">
              {statsLoading ? '...' : stats?.totalClients || 0}
            </p>
            <p style={{ color: branding.textColor }} className="opacity-75 text-xs mt-2">
              Clientes cadastrados
            </p>
          </div>

          {/* Technicians */}
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: `${branding.primaryColor}15`,
              borderColor: `${branding.primaryColor}33`,
            }}
          >
            <h3 style={{ color: branding.primaryColor }} className="font-semibold mb-4 text-sm">
              Total de Técnicos
            </h3>
            <p style={{ color: branding.textColor }} className="text-3xl font-bold">
              {statsLoading ? '...' : stats?.totalTechnicians || 0}
            </p>
            <p style={{ color: branding.textColor }} className="opacity-75 text-xs mt-2">
              Técnicos disponíveis
            </p>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Orders Card */}
          <div
            className="p-6 rounded-lg border cursor-pointer hover:shadow-lg transition-shadow"
            style={{
              backgroundColor: `${branding.primaryColor}0a`,
              borderColor: `${branding.primaryColor}33`,
            }}
            onClick={() => router.push('/orders')}
          >
            <h3 style={{ color: branding.primaryColor }} className="font-semibold mb-2">
              Ordens de Serviço
            </h3>
            <p style={{ color: branding.textColor }} className="opacity-75 text-sm">
              Gerencie suas ordens de serviço
            </p>
            <p className="mt-4 text-sm" style={{ color: branding.accentColor }}>
              Ver todas →
            </p>
          </div>

          {/* Clients Card */}
          <div
            className="p-6 rounded-lg border cursor-pointer hover:shadow-lg transition-shadow"
            style={{
              backgroundColor: `${branding.secondaryColor}0a`,
              borderColor: `${branding.secondaryColor}33`,
            }}
            onClick={() => router.push('/clients')}
          >
            <h3 style={{ color: branding.secondaryColor }} className="font-semibold mb-2">
              Clientes
            </h3>
            <p style={{ color: branding.textColor }} className="opacity-75 text-sm">
              Gerencie seus clientes
            </p>
            <p className="mt-4 text-sm" style={{ color: branding.accentColor }}>
              Ver todos →
            </p>
          </div>

          {/* Settings Card */}
          <div
            className="p-6 rounded-lg border cursor-pointer hover:shadow-lg transition-shadow"
            style={{
              backgroundColor: `${branding.accentColor}0a`,
              borderColor: `${branding.accentColor}33`,
            }}
            onClick={() => router.push(`/settings/branding`)}
          >
            <h3 style={{ color: branding.accentColor }} className="font-semibold mb-2">
              Configurações
            </h3>
            <p style={{ color: branding.textColor }} className="opacity-75 text-sm">
              Customize seu espaço de trabalho
            </p>
            <p className="mt-4 text-sm" style={{ color: branding.accentColor }}>
              Configurar →
            </p>
          </div>
        </div>

        {/* Welcome Section */}
        <div
          className="p-8 rounded-lg border"
          style={{
            backgroundColor: `${branding.primaryColor}08`,
            borderColor: `${branding.primaryColor}1a`,
          }}
        >
          <h2 style={{ color: branding.textColor }} className="text-2xl font-bold mb-4">
            Bem-vindo de volta ao {tenant.name}!
          </h2>
          <p style={{ color: branding.textColor }} className="opacity-75 leading-relaxed max-w-2xl">
            Aqui você pode gerenciar suas operações, visualizar relatórios em tempo real e configurar
            tudo do jeito que você gosta. O sistema está totalmente personalizado com suas cores e branding.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/orders')}
              style={{
                backgroundColor: branding.primaryColor,
                color: branding.backgroundColor,
              }}
              className="px-6 py-2 rounded font-medium hover:opacity-90 transition-opacity"
            >
              Ver Ordens de Serviço
            </button>
            <button
              onClick={() => router.push('/clients')}
              style={{
                color: branding.primaryColor,
                borderColor: branding.primaryColor,
              }}
              className="px-6 py-2 rounded font-medium border hover:opacity-75 transition-opacity"
            >
              Gerenciar Clientes
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
