'use client'

import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

interface OrdersStatusChartProps {
  data: Array<{
    name: string
    value: number
  }>
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export function OrdersStatusChart({ data }: OrdersStatusChartProps) {
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
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
