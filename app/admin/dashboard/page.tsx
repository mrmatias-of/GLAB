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
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-white">Painel de Controle</h1>
        <p className="text-slate-400 mt-1 text-sm">Bem-vindo ao painel administrativo de assistência técnica</p>
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
          color="blue"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <div className="card-elegant bg-slate-900/30">
          <h2 className="text-lg font-bold text-white mb-2">Distribuição de Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #404040', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="value" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Overview */}
        <div className="card-elegant bg-slate-900/30">
          <h2 className="text-lg font-bold text-white mb-2">Visão Financeira</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg border border-green-500/20">
              <span className="text-green-400 text-sm font-medium">Receita do Mês</span>
              <span className="text-base font-bold text-green-400">R$ {stats.receitaMes.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-red-500/10 rounded-lg border border-red-500/20">
              <span className="text-red-400 text-sm font-medium">Despesa do Mês</span>
              <span className="text-base font-bold text-red-400">R$ {stats.despesaMes.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <span className="text-blue-400 text-sm font-medium">Lucro Líquido</span>
              <span className="text-base font-bold text-blue-400">R$ {margem.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-elegant bg-slate-900/30">
        <h2 className="text-lg font-bold text-white mb-2">Atalhos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <a
            href="/admin/ordens-servico"
            className="p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 transition cursor-pointer"
          >
            <div className="text-blue-400 text-sm font-semibold">Ordens de Serviço</div>
            <div className="text-xs text-blue-500/70">Gerenciar OS</div>
          </a>
          <a
            href="/admin/clientes"
            className="p-3 bg-green-500/10 hover:bg-green-500/20 rounded-lg border border-green-500/20 transition cursor-pointer"
          >
            <div className="text-green-400 text-sm font-semibold">Clientes</div>
            <div className="text-xs text-green-500/70">Gerenciar clientes</div>
          </a>
          <a
            href="/admin/tecnicos"
            className="p-3 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg border border-yellow-500/20 transition cursor-pointer"
          >
            <div className="text-yellow-400 text-sm font-semibold">Técnicos</div>
            <div className="text-xs text-yellow-500/70">Gerenciar técnicos</div>
          </a>
          <a
            href="/admin/estoque"
            className="p-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg border border-purple-500/20 transition cursor-pointer"
          >
            <div className="text-purple-400 text-sm font-semibold">Estoque</div>
            <div className="text-xs text-purple-500/70">Gerenciar estoque</div>
          </a>
        </div>
      </div>
    </div>
  )
}
