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
    cyan: 'bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/30 hover:border-cyan-500/60',
    blue: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/30 hover:border-blue-500/60',
    green: 'bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/30 hover:border-green-500/60',
    red: 'bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/30 hover:border-red-500/60',
    yellow: 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/30 hover:border-yellow-500/60',
  }

  const textColorMap = {
    cyan: 'text-cyan-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
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

  return (
    <div
      onClick={onClick}
      className={`p-6 border rounded-lg ${colorClasses[color]} bg-slate-900/40 backdrop-blur-sm transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105 hover:shadow-2xl' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <p className="text-4xl font-bold text-white mt-3">{value}</p>

          {trend !== undefined && (
            <div className="flex items-center gap-2 mt-4">
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${trend > 0 ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                {trend > 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-400" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(trend)}%
                </span>
              </div>
              {trendLabel && <span className="text-xs text-slate-500">{trendLabel}</span>}
            </div>
          )}
        </div>
        {iconName && (
          <div className={`${textColorMap[color]} opacity-15 ml-4 flex-shrink-0`}>
            {getIcon()}
          </div>
        )}
      </div>
    </div>
  )
}
