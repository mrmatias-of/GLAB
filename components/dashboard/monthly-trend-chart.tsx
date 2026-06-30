'use client'

import React from 'react'
import useSWR from 'swr'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function MonthlyTrendChart() {
  const { data: response, isLoading, error } = useSWR(
    '/api/dashboard/monthly-trend',
    fetcher,
    { revalidateOnFocus: false }
  )

  const data = response?.data || []

  if (isLoading) {
    return (
      <div className="w-full h-80 bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  if (error || !response?.success) {
    return (
      <div className="w-full h-80 bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-center">
        <div className="text-red-500">Erro ao carregar dados</div>
      </div>
    )
  }

  return (
    <div className="w-full h-80 bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Tendência de Receita
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value) => `R$ ${(value as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Receita"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
