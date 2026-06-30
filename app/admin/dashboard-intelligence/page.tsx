'use client'

import React, { useState, useCallback } from 'react'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { OrdersStatusChart } from '@/components/dashboard/orders-status-chart'
import { TechnicianPerformanceChart } from '@/components/dashboard/technician-performance-chart'
import { MonthlyTrendChart } from '@/components/dashboard/monthly-trend-chart'

// Mock data - will be replaced with real API calls
const generateMockRevenueData = () => [
  { mes: 'Janeiro', receita: 45000, despesa: 28000, lucro: 17000 },
  { mes: 'Fevereiro', receita: 52000, despesa: 31000, lucro: 21000 },
  { mes: 'Março', receita: 48000, despesa: 29000, lucro: 19000 },
  { mes: 'Abril', receita: 61000, despesa: 35000, lucro: 26000 },
  { mes: 'Maio', receita: 55000, despesa: 32000, lucro: 23000 },
  { mes: 'Junho', receita: 67000, despesa: 38000, lucro: 29000 },
]

const generateMockOrdersStatusData = () => [
  { name: 'Concluídas', value: 145 },
  { name: 'Em Andamento', value: 32 },
  { name: 'Pendentes', value: 18 },
  { name: 'Canceladas', value: 5 },
]

const generateMockTechnicianData = () => [
  { tecnico: 'João', ordensCompletas: 28, tempo_medio: 2.5, satisfacao: 95 },
  { tecnico: 'Maria', ordensCompletas: 35, tempo_medio: 2.1, satisfacao: 98 },
  { tecnico: 'Pedro', ordensCompletas: 22, tempo_medio: 3.0, satisfacao: 92 },
  { tecnico: 'Ana', ordensCompletas: 31, tempo_medio: 2.3, satisfacao: 96 },
]

const generateMockTrendData = () => [
  { mes: 'Jan', receita: 45000, meta: 50000 },
  { mes: 'Fev', receita: 52000, meta: 50000 },
  { mes: 'Mar', receita: 48000, meta: 55000 },
  { mes: 'Abr', receita: 61000, meta: 55000 },
  { mes: 'Mai', receita: 55000, meta: 60000 },
  { mes: 'Jun', receita: 67000, meta: 60000 },
]

interface KPI {
  label: string
  value: string
  change: number
  trend: 'up' | 'down'
}

export default function DashboardIntelligencePage() {
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month')
  const [startDate, setStartDate] = useState<Date>(startOfMonth(subMonths(new Date(), 6)))
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()))

  const kpis: KPI[] = [
    { label: 'Receita Total', value: 'R$ 328.000', change: 12.5, trend: 'up' },
    { label: 'Lucro', value: 'R$ 135.000', change: 8.2, trend: 'up' },
    { label: 'Ordens Completas', value: '200', change: 5.3, trend: 'up' },
    { label: 'Satisfação Média', value: '95.3%', change: 2.1, trend: 'up' },
  ]

  const handleExportPDF = useCallback(() => {
    // Placeholder for PDF export
    alert('Exportar PDF será implementado com jsPDF')
  }, [])

  const handleExportExcel = useCallback(() => {
    // Placeholder for Excel export
    alert('Exportar Excel será implementado com xlsx')
  }, [])

  return (
    <main className="flex-1 space-y-6">
      {/* Header - Responsive */}
      <div className="px-4 lg:px-8 pt-4 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div className="flex-1">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-100">Dashboard Inteligente</h2>
          <p className="text-slate-400 mt-1 text-sm lg:text-base">Visualize métricas e insights de seu negócio</p>
        </div>

        {/* Filters and Actions - Stack on mobile */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleExportPDF}
            className="px-3 lg:px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 font-medium transition-colors text-sm"
          >
            PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3 lg:px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-medium transition-colors text-sm"
          >
            Excel
          </button>
        </div>
      </div>

      {/* Period Selector - Mobile optimized */}
      <div className="mx-4 lg:mx-8 bg-slate-900/50 rounded-lg border border-slate-700/50 p-3 lg:p-4 flex items-center gap-2 overflow-x-auto">
        <span className="text-sm font-medium text-slate-400 whitespace-nowrap">Período:</span>
        <button
          onClick={() => setPeriod('month')}
          className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
            period === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Mês
        </button>
        <button
          onClick={() => setPeriod('quarter')}
          className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
            period === 'quarter'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Trimestre
        </button>
        <button
          onClick={() => setPeriod('year')}
          className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
            period === 'year'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Ano
        </button>
      </div>

      {/* KPIs */}
      <div className="px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-4 lg:p-6 hover:border-slate-600 transition-colors"
          >
            <p className="text-slate-400 text-sm font-medium">{kpi.label}</p>
            <p className="text-xl lg:text-2xl font-bold text-slate-100 mt-2">{kpi.value}</p>
            <p
              className={`text-sm font-medium mt-2 ${
                kpi.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {kpi.trend === 'up' ? '↑' : '↓'} {kpi.change}%
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <RevenueChart period={period} />
        <OrdersStatusChart />
        <TechnicianPerformanceChart />
        <MonthlyTrendChart />
      </div>
    </main>
  )
}
