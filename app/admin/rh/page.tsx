'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, FileText, Clock, TrendingUp, Plus } from 'lucide-react'

interface DashboardStats {
  totalFuncionarios: number
  funcionariosAtivos: number
  folhasProcessadas: number
  folhasPendentes: number
}

export default function DashboardRH() {
  const [stats, setStats] = useState<DashboardStats>({
    totalFuncionarios: 0,
    funcionariosAtivos: 0,
    folhasProcessadas: 0,
    folhasPendentes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const [funcionarios, contracheques] = await Promise.all([
        fetch('/api/rh/funcionarios').then((r) => r.json()),
        fetch('/api/rh/contracheques').then((r) => r.json()),
      ])

      const ativos = funcionarios.filter((f: any) => f.status === 'ativo').length
      const processados = contracheques.filter((c: any) => c.status_pagamento === 'pago').length
      const pendentes = contracheques.filter((c: any) => c.status_pagamento === 'pendente').length

      setStats({
        totalFuncionarios: funcionarios.length,
        funcionariosAtivos: ativos,
        folhasProcessadas: processados,
        folhasPendentes: pendentes,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      icon: Users,
      label: 'Funcionários',
      value: stats.totalFuncionarios,
      href: '/admin/rh/funcionarios',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: FileText,
      label: 'Funcionários Ativos',
      value: stats.funcionariosAtivos,
      href: '/admin/rh/funcionarios',
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: TrendingUp,
      label: 'Folhas Processadas',
      value: stats.folhasProcessadas,
      href: '/admin/rh/contracheques',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: Clock,
      label: 'Folhas Pendentes',
      value: stats.folhasPendentes,
      href: '/admin/rh/contracheques',
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Recursos Humanos</h1>
          <p className="text-slate-500 mt-2">Gestão de folha de pagamento e funcionários</p>
        </div>
        <Link
          href="/admin/rh/funcionarios"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Funcionário
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const IconComponent = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`${card.color} p-6 rounded-lg border border-slate-200 hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalFuncionarios > 0 || !loading ? card.value : '-'}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <Link
              href="/admin/rh/funcionarios"
              className="block px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors text-sm font-medium"
            >
              Gerenciar Funcionários
            </Link>
            <Link
              href="/admin/rh/contracheques"
              className="block px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors text-sm font-medium"
            >
              Visualizar Contracheques
            </Link>
            <Link
              href="/admin/rh/gerar-folha"
              className="block px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-sm font-medium"
            >
              Gerar Folha de Pagamento
            </Link>
            <Link
              href="/admin/rh/banco-horas"
              className="block px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors text-sm font-medium"
            >
              Banco de Horas
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Informações</h3>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-800">
              <p className="font-medium mb-1">Cálculos Automáticos</p>
              <p>INSS progressivo, IRPF com faixas, FGTS 8% e adicionais</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-800">
              <p className="font-medium mb-1">Padrão 2024</p>
              <p>Valores e alíquotas de impostos atualizadas para 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
