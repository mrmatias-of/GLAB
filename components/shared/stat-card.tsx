'use client'

import React from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  trend?: 'up' | 'down'
  className?: string
}

export function StatCard({ title, value, change, icon, trend = 'up', className = '' }: StatCardProps) {
  const isPositive = trend === 'up'

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-slate-100">{value}</p>
        </div>
        {icon && (
          <div className="ml-4 p-2 rounded-lg bg-blue-500/10">
            {icon}
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositive
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}>
            {isPositive ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            {Math.abs(change)}%
          </div>
          <span className="text-xs text-slate-500">vs last month</span>
        </div>
      )}
    </div>
  )
}
