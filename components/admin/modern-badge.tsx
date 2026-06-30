'use client'

import React from 'react'

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending'

const statusConfig: Record<StatusType, { bg: string; text: string; dot: string }> = {
  success: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  warning: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-500' },
  error: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-500' },
  info: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-500' },
  pending: { bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-500' },
}

interface ModernBadgeProps {
  status: StatusType
  label: string
  dot?: boolean
}

export function ModernBadge({ status, label, dot = true }: ModernBadgeProps) {
  const config = statusConfig[status]

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {dot && <div className={`w-2 h-2 rounded-full ${config.dot}`} />}
      {label}
    </div>
  )
}
