'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Ticket {
  id: number
  titulo: string
  status: string
  prioridade: string
  criado_em: string
  usuario_id: string
  responsavel_id?: string
}

const statusBadgeColors = {
  aberto: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  em_andamento: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  resolvido: 'bg-green-500/20 text-green-400 border-green-500/30',
  fechado: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const prioridadeBadgeColors = {
  baixa: 'bg-blue-500/10 text-blue-300',
  media: 'bg-cyan-500/10 text-cyan-300',
  alta: 'bg-orange-500/10 text-orange-300',
  urgente: 'bg-red-500/10 text-red-300',
}

export default function SupportAdminDashboard() {
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('todos')
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    total: 0,
    aberto: 0,
    em_andamento: 0,
    resolvido: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        setUser(user)

        const isAdmin = user.user_metadata?.is_admin === true

        // Buscar tickets (admin vê todos, vendedor vê seus atribuídos)
        const url = isAdmin ? '/api/support/tickets?type=all' : '/api/support/tickets?type=assigned'
        const response = await fetch(url)
        if (!response.ok) throw new Error('Erro ao carregar tickets')

        const data = await response.json()
        setTickets(data)

        // Calcular stats
        setStats({
          total: data.length,
          aberto: data.filter((t: Ticket) => t.status === 'aberto').length,
          em_andamento: data.filter((t: Ticket) => t.status === 'em_andamento').length,
          resolvido: data.filter((t: Ticket) => t.status === 'resolvido').length,
        })
      } catch (error) {
        console.error('Erro ao buscar tickets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, router])

  // Aplicar filtro
  useEffect(() => {
    if (filter === 'todos') {
      setFilteredTickets(tickets)
    } else {
      setFilteredTickets(tickets.filter(t => t.status === filter))
    }
  }, [tickets, filter])

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} color="cyan" />
        <StatCard title="Aberto" value={stats.aberto} color="blue" />
        <StatCard title="Em Progresso" value={stats.em_andamento} color="yellow" />
        <StatCard title="Resolvido" value={stats.resolvido} color="green" />
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {['todos', 'aberto', 'em_andamento', 'resolvido', 'fechado'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded border transition-colors text-sm ${
              filter === status
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                : 'border-cyan-500/20 text-gray-400 hover:border-cyan-500/30'
            }`}
          >
            {status === 'todos' ? 'Todos' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tabela de Tickets */}
      <div className="border border-cyan-500/20 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-500/20 bg-cyan-500/5">
                <th className="px-4 py-3 text-left text-sm font-semibold text-cyan-400">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-cyan-400">Título</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-cyan-400">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-cyan-400">Prioridade</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-cyan-400">Criado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-cyan-400">Ação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Carregando...
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Nenhum ticket encontrado
                  </td>
                </tr>
              ) : (
                filteredTickets.map(ticket => (
                  <tr key={ticket.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-400">#{ticket.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate">{ticket.titulo}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs border ${statusBadgeColors[ticket.status as keyof typeof statusBadgeColors]}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${prioridadeBadgeColors[ticket.prioridade as keyof typeof prioridadeBadgeColors]}`}>
                        {ticket.prioridade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(ticket.criado_em).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        href={`/admin/suporte/${ticket.id}`}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: number; color: 'cyan' | 'blue' | 'yellow' | 'green' }) {
  const colors = {
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
  }

  return (
    <div className={`p-4 rounded border ${colors[color]}`}>
      <p className="text-xs opacity-75 mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}
