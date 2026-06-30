'use client'

import React from 'react'
import useSWR from 'swr'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function OrdersStatusChart() {
  const { data: response, isLoading, error } = useSWR(
    '/api/dashboard/orders-status',
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
        Ordens por Status
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((item: any, index: number) => (
              <Cell key={`cell-${index}`} fill={item.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
