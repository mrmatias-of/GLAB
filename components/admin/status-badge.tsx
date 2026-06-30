'use client'

interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

const statusVariants: Record<string, Record<string, string>> = {
  default: 'bg-slate-700 text-slate-200',
  success: 'bg-green-500/20 text-green-400 border border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  error: 'bg-red-500/20 text-red-400 border border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
}

const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  ativo: 'success',
  inativo: 'error',
  aberto: 'info',
  em_progresso: 'warning',
  pausado: 'warning',
  finalizado: 'success',
  cancelado: 'error',
  pago: 'success',
  pendente: 'warning',
  atrasado: 'error',
  ativo_status: 'success',
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const displayVariant = variant || (statusMap[status] || 'default')
  const displayText = status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusVariants[displayVariant]}`}>
      {displayText}
    </span>
  )
}
