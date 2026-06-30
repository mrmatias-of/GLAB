'use client'

import React from 'react'
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

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function TechnicianPerformanceChart() {
  const { data: response, isLoading, error } = useSWR(
    '/api/dashboard/technician-performance',
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
        Produtividade de Técnicos
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip formatter={(value) => parseFloat(value).toFixed(2)} />
          <Legend />
          <Bar yAxisId="left" dataKey="revenue" fill="#10b981" name="Receita" />
          <Bar yAxisId="right" dataKey="rating" fill="#f59e0b" name="Avaliação" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
