'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface RevenueChartProps {
  data: Array<{
    mes: string
    receita: number
    despesa: number
    lucro: number
  }>
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="w-full h-80 bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Receita vs Despesa
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip
            formatter={(value) => `R$ ${(value as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          />
          <Legend />
          <Bar dataKey="receita" fill="#10b981" name="Receita" />
          <Bar dataKey="despesa" fill="#ef4444" name="Despesa" />
          <Bar dataKey="lucro" fill="#3b82f6" name="Lucro" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
