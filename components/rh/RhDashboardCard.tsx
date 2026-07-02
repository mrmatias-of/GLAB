interface RhDashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  color?: 'blue' | 'green' | 'amber' | 'red'
  onClick?: () => void
}

const colorClasses = {
  blue: 'bg-blue-500/20 border-blue-400 text-blue-300',
  green: 'bg-green-500/20 border-green-400 text-green-300',
  amber: 'bg-amber-500/20 border-amber-400 text-amber-300',
  red: 'bg-red-500/20 border-red-400 text-red-300',
}

export default function RhDashboardCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  onClick,
}: RhDashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-6 border rounded-lg cursor-pointer transition hover:shadow-lg ${colorClasses[color]} ${
        onClick ? 'hover:shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium opacity-80">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
    </div>
  )
}
