'use client'

import React from 'react'
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

interface MonthlytrendChartProps {
  data: Array<{
    mes: string
    receita: number
    meta: number
  }>
}

export function MonthlyTrendChart({ data }: MonthlytrendChartProps) {
  return (
    <div className="w-full h-80 bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Tendência de Receita vs Meta
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip
            formatter={(value) => `R$ ${(value as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="receita"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorReceita)"
            name="Receita"
          />
          <Area
            type="monotone"
            dataKey="meta"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorMeta)"
            name="Meta"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
