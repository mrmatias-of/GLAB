'use client'

import {
  ArrowUp,
  ArrowDown,
  FileText,
  Cog,
  CheckCircle,
  XCircle,
  Wrench,
  Users,
  DollarSign,
  TrendingUp,
} from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  iconName?: 'clipboard' | 'cog' | 'check' | 'x' | 'wrench' | 'users' | 'dollar' | 'trending'
  trend?: number
  trendLabel?: string
  color?: 'cyan' | 'blue' | 'green' | 'red' | 'yellow'
  onClick?: () => void
}

export function StatCard({
  title,
  value,
  iconName,
  trend,
  trendLabel,
  color = 'cyan',
  onClick,
}: StatCardProps) {
  const colorClasses = {
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  }

  const getIcon = () => {
    switch (iconName) {
      case 'clipboard':
        return <FileText className="w-8 h-8" />
      case 'cog':
        return <Cog className="w-8 h-8" />
      case 'check':
        return <CheckCircle className="w-8 h-8" />
      case 'x':
        return <XCircle className="w-8 h-8" />
      case 'wrench':
        return <Wrench className="w-8 h-8" />
      case 'users':
        return <Users className="w-8 h-8" />
      case 'dollar':
        return <DollarSign className="w-8 h-8" />
      case 'trending':
        return <TrendingUp className="w-8 h-8" />
      default:
        return null
    }
  }

  const textColorMap = {
    cyan: 'text-cyan-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
  }

  return (
    <div
      onClick={onClick}
      className={`p-6 border rounded-lg ${colorClasses[color]} ${onClick ? 'cursor-pointer hover:shadow-lg transition' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>

          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend > 0 ? (
                <ArrowUp className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend)}%
              </span>
              {trendLabel && <span className="text-xs text-slate-500">{trendLabel}</span>}
            </div>
          )}
        </div>
        {iconName && <div className={`${textColorMap[color]} opacity-30`}>{getIcon()}</div>}
      </div>
    </div>
  )
}
