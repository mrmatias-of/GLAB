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

interface CashFlowChartProps {
  data: Array<{
    mes: string
    entrada: number
    saida: number
    saldo: number
  }>
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Fluxo de Caixa</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip
            formatter={(value) => `R$ ${(value as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          />
          <Legend />
          <Bar dataKey="entrada" fill="#10b981" name="Entradas" />
          <Bar dataKey="saida" fill="#ef4444" name="Saídas" />
          <Bar dataKey="saldo" fill="#3b82f6" name="Saldo" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
