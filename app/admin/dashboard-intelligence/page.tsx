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
    <main className="flex-1 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Inteligente</h1>
          <p className="text-gray-600 mt-1">Visualize métricas e insights de seu negócio</p>
        </div>

        {/* Filters and Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium transition-colors"
          >
            Exportar PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors"
          >
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Período:</span>
        <button
          onClick={() => setPeriod('month')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Mês
        </button>
        <button
          onClick={() => setPeriod('quarter')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === 'quarter'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Trimestre
        </button>
        <button
          onClick={() => setPeriod('year')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === 'year'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Ano
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <p className="text-gray-600 text-sm font-medium">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
            <p
              className={`text-sm font-medium mt-2 ${
                kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {kpi.trend === 'up' ? '↑' : '↓'} {kpi.change}%
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart period={period} />
        <OrdersStatusChart />
        <TechnicianPerformanceChart />
        <MonthlyTrendChart />
      </div>
    </main>
  )
}
