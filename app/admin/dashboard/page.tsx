'use client'

import { useEffect, useState } from 'react'
import { StatCard } from '@/components/shared/stat-card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DashboardStats {
  osAberta: number
  osEmProgresso: number
  osFinalizadas: number
  osCanceladas: number
  receitaMes: number
  despesaMes: number
  tecnicos: number
  clientes: number
}

interface ChartData {
  name: string
  value: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    osAberta: 0,
    osEmProgresso: 0,
    osFinalizadas: 0,
    osCanceladas: 0,
    receitaMes: 0,
    despesaMes: 0,
    tecnicos: 0,
    clientes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [osRes, clientesRes, tecnicosRes, financeirosRes] = await Promise.all([
        fetch('/api/ordens-servico'),
        fetch('/api/clientes'),
        fetch('/api/tecnicos'),
        fetch('/api/financeiro').catch(() => null),
      ])

      if (osRes.ok && clientesRes.ok && tecnicosRes.ok) {
        const [osData, clientesData, tecnicosData] = await Promise.all([
          osRes.json(),
          clientesRes.json(),
          tecnicosRes.json(),
        ])

        const osAberta = osData.filter((o: any) => o.status === 'aberto').length
        const osEmProgresso = osData.filter((o: any) => o.status === 'em_progresso').length
        const osFinalizadas = osData.filter((o: any) => o.status === 'finalizado').length
        const osCanceladas = osData.filter((o: any) => o.status === 'cancelado').length

        setStats({
          osAberta,
          osEmProgresso,
          osFinalizadas,
          osCanceladas,
          receitaMes: 0,
          despesaMes: 0,
          tecnicos: tecnicosData.length,
          clientes: clientesData.length,
        })
      }
    } catch (error) {
      console.error('[v0] fetchStats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusChartData: ChartData[] = [
    { name: 'Aberto', value: stats.osAberta },
    { name: 'Em Progresso', value: stats.osEmProgresso },
    { name: 'Finalizado', value: stats.osFinalizadas },
    { name: 'Cancelado', value: stats.osCanceladas },
  ]

  const margem = stats.receitaMes - stats.despesaMes
  const margemPercentual = stats.receitaMes > 0 ? ((margem / stats.receitaMes) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Painel de Controle</h1>
        <p className="text-slate-600 mt-2">Bem-vindo ao painel administrativo de assistência técnica</p>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ordens Abertas"
          value={stats.osAberta}
          iconName="clipboard"
          color="blue"
          onClick={() => window.location.href = '/admin/ordens-servico?status=aberto'}
        />
        <StatCard
          title="Em Andamento"
          value={stats.osEmProgresso}
          iconName="cog"
          color="yellow"
          onClick={() => window.location.href = '/admin/ordens-servico?status=em_progresso'}
        />
        <StatCard
          title="Finalizadas"
          value={stats.osFinalizadas}
          iconName="check"
          color="green"
          onClick={() => window.location.href = '/admin/ordens-servico?status=finalizado'}
        />
        <StatCard
          title="Canceladas"
          value={stats.osCanceladas}
          iconName="x"
          color="red"
          onClick={() => window.location.href = '/admin/ordens-servico?status=cancelado'}
        />
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Técnicos Cadastrados"
          value={stats.tecnicos}
          iconName="wrench"
          color="cyan"
          onClick={() => window.location.href = '/admin/tecnicos'}
        />
        <StatCard
          title="Clientes Ativos"
          value={stats.clientes}
          iconName="users"
          color="blue"
          onClick={() => window.location.href = '/admin/clientes'}
        />
        <StatCard
          title="Receita do Mês"
          value={`R$ ${stats.receitaMes.toFixed(2)}`}
          iconName="dollar"
          color="green"
          trend={15}
          trendLabel="vs mês anterior"
        />
        <StatCard
          title="Margem de Lucro"
          value={`${margemPercentual}%`}
          iconName="trending"
          color="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg border border-slate-300">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Distribuição de Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Overview */}
        <div className="bg-white p-6 rounded-lg border border-slate-300">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Visão Financeira</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-700 font-medium">Receita do Mês</span>
              <span className="text-xl font-bold text-green-700">R$ {stats.receitaMes.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-red-700 font-medium">Despesa do Mês</span>
              <span className="text-xl font-bold text-red-700">R$ {stats.despesaMes.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-blue-700 font-medium">Lucro Líquido</span>
              <span className="text-xl font-bold text-blue-700">R$ {margem.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg border border-slate-300">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Atalhos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="/admin/ordens-servico"
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition cursor-pointer"
          >
            <div className="text-blue-700 font-semibold">Ordens de Serviço</div>
            <div className="text-sm text-blue-600">Gerenciar OS</div>
          </a>
          <a
            href="/admin/clientes"
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition cursor-pointer"
          >
            <div className="text-green-700 font-semibold">Clientes</div>
            <div className="text-sm text-green-600">Gerenciar clientes</div>
          </a>
          <a
            href="/admin/tecnicos"
            className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition cursor-pointer"
          >
            <div className="text-yellow-700 font-semibold">Técnicos</div>
            <div className="text-sm text-yellow-600">Gerenciar técnicos</div>
          </a>
          <a
            href="/admin/estoque"
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition cursor-pointer"
          >
            <div className="text-purple-700 font-semibold">Estoque</div>
            <div className="text-sm text-purple-600">Gerenciar estoque</div>
          </a>
        </div>
      </div>
    </div>
  )
}
