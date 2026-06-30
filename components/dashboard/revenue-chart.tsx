'use client'

import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
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
  period?: 'month' | 'quarter' | 'year'
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function RevenueChart({ period = 'month' }: RevenueChartProps) {
  const { data: response, isLoading, error } = useSWR(
    `/api/dashboard/revenue?period=${period}`,
    fetcher,
    { revalidateOnFocus: false }
  )

  const chartData = response?.data || []

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
        Receita vs Despesa
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) => `R$ ${(value as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#10b981" name="Receita" />
          <Bar dataKey="expenses" fill="#ef4444" name="Despesa" />
          <Bar dataKey="profit" fill="#3b82f6" name="Lucro" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
