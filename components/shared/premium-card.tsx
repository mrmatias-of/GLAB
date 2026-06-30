'use client'

import React from 'react'

interface PremiumCardProps {
  children: React.ReactNode
  className?: string
  elevated?: boolean
  interactive?: boolean
}

export function PremiumCard({ children, className = '', elevated = false, interactive = false }: PremiumCardProps) {
  return (
    <div className={`
      rounded-lg border bg-slate-900/50 backdrop-blur-sm
      ${elevated ? 'shadow-lg border-slate-700' : 'border-slate-700/50'}
      ${interactive ? 'hover:border-slate-600 hover:shadow-lg transition-all cursor-pointer' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}
