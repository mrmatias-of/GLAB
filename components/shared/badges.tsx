'use client'

interface StatusBadgeProps {
  status: string
  label?: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusConfig: Record<
    string,
    { bg: string; text: string; border: string; label: string }
  > = {
    aberto: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Aberto' },
    em_progresso: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      label: 'Em Progresso',
    },
    pausado: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: 'Pausado' },
    finalizado: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Finalizado' },
    cancelado: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Cancelado' },
    pendente: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Pendente' },
    pago: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Pago' },
    atrasado: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Atrasado' },
    ativo: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Ativo' },
    inativo: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', label: 'Inativo' },
    ferias: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Férias' },
  }

  const config = statusConfig[status] || statusConfig.aberto
  const displayLabel = label || config.label

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {displayLabel}
    </span>
  )
}

interface PriorityBadgeProps {
  priority: string
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const priorityConfig: Record<string, { bg: string; text: string; icon: string }> = {
    alta: { bg: 'bg-red-100', text: 'text-red-700', icon: '🔴' },
    normal: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🟡' },
    baixa: { bg: 'bg-green-100', text: 'text-green-700', icon: '🟢' },
  }

  const config = priorityConfig[priority] || priorityConfig.normal

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.icon} {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

interface RatingBadgeProps {
  rating?: number | null
  maxRating?: number
}

export function RatingBadge({ rating, maxRating = 5 }: RatingBadgeProps) {
  if (!rating) return <span className="text-slate-400">Sem avaliação</span>

  return (
    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
      ★ {Number(rating).toFixed(1)} / {maxRating}
    </span>
  )
}
