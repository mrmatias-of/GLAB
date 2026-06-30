'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface TechnicianPerformanceChartProps {
  data: Array<{
    tecnico: string
    ordensCompletas: number
    tempo_medio: number
    satisfacao: number
  }>
}

export function TechnicianPerformanceChart({ data }: TechnicianPerformanceChartProps) {
  return (
    <div className="w-full h-80 bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Produtividade de Técnicos
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tecnico" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ordensCompletas"
            stroke="#3b82f6"
            name="Ordens Completas"
            dot={{ fill: '#3b82f6' }}
          />
          <Line
            type="monotone"
            dataKey="satisfacao"
            stroke="#10b981"
            name="Satisfação (%)"
            dot={{ fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
