'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Ticket {
  id: number
  titulo: string
  descricao: string
  status: string
  prioridade: string
  criado_em: string
  categoria_id: number
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

export default function MeusTicketsPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('todos')

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Middleware protege a rota - usuário já está autenticado se chegou aqui

        const response = await fetch('/api/support/tickets?type=user')
        if (!response.ok) throw new Error('Erro ao carregar tickets')

        const data = await response.json()
        setTickets(data)
      } catch (error) {
        console.error('Erro ao buscar tickets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [router])

  const filteredTickets = filter === 'todos' 
    ? tickets 
    : tickets.filter(t => t.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Meus Tickets</h2>
        <p className="text-gray-400">Acompanhe seus tickets de suporte</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {['todos', 'aberto', 'em_andamento', 'resolvido', 'fechado'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded border transition-colors ${
              filter === status
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                : 'border-cyan-500/20 text-gray-400 hover:border-cyan-500/30'
            }`}
          >
            {status === 'todos' ? 'Todos' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Lista de Tickets */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Carregando...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Nenhum ticket encontrado
          </div>
        ) : (
          filteredTickets.map(ticket => (
            <Link
              key={ticket.id}
              href={`/suporte/${ticket.id}`}
              className="block p-4 rounded border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{ticket.titulo}</h3>
                    <span className={`px-2 py-1 rounded text-xs border ${statusBadgeColors[ticket.status as keyof typeof statusBadgeColors]}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-1">{ticket.descricao}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded text-xs ${prioridadeBadgeColors[ticket.prioridade as keyof typeof prioridadeBadgeColors]}`}>
                    {ticket.prioridade}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(ticket.criado_em).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
