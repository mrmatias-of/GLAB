'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface Ticket {
  id: number
  titulo: string
  descricao: string
  status: string
  prioridade: string
  criado_em: string
  atualizado_em: string
  categoria_id: number
  usuario_id: string
  responsavel_id?: string
}

interface Message {
  id: number
  autor_id: string
  mensagem: string
  criado_em: string
  tipo: string
}

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const ticketId = params?.id as string

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string>('')
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        // Middleware protege a rota - usuário já está autenticado se chegou aqui
        // Obter dados do usuário do endpoint /api/auth/me

        // Buscar ticket
        const ticketResponse = await fetch(`/api/support/tickets/${ticketId}`)
        if (!ticketResponse.ok) throw new Error('Ticket não encontrado')
        const ticketData = await ticketResponse.json()
        setTicket(ticketData)

        // Verificar permissão de acesso
        if (ticketData.usuario_id !== user.id && user.user_metadata?.is_admin !== true && user.user_metadata?.is_vendedor !== true) {
          router.push('/suporte/meus-tickets')
          return
        }

        // Buscar mensagens
        const messagesResponse = await fetch(`/api/support/tickets/${ticketId}/messages`)
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json()
          setMessages(messagesData)
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error)
        setError('Erro ao carregar ticket')
      } finally {
        setLoading(false)
      }
    }

    if (ticketId) fetchTicketDetails()
  }, [ticketId, router])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !ticket) return

    setSending(true)
    try {
      const response = await fetch(`/api/support/tickets/${ticket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: newMessage }),
      })

      if (!response.ok) throw new Error('Erro ao enviar mensagem')

      const message = await response.json()
      setMessages([...messages, message])
      setNewMessage('')
    } catch (error) {
      console.error('Erro:', error)
      setError('Erro ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Carregando...</div>
  }

  if (!ticket) {
    return <div className="text-center py-8 text-red-400">Ticket não encontrado</div>
  }

  const statusColor = {
    aberto: 'text-blue-400 bg-blue-500/20',
    em_andamento: 'text-yellow-400 bg-yellow-500/20',
    resolvido: 'text-green-400 bg-green-500/20',
    fechado: 'text-gray-400 bg-gray-500/20',
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header do Ticket */}
      <div className="p-6 rounded border border-cyan-500/20 bg-cyan-500/5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{ticket.titulo}</h1>
            <p className="text-gray-400">Ticket #{ticket.id}</p>
          </div>
          <span className={`px-3 py-1 rounded text-sm font-medium ${statusColor[ticket.status as keyof typeof statusColor]}`}>
            {ticket.status.replace('_', ' ')}
          </span>
        </div>
        <p className="text-gray-300 mb-4">{ticket.descricao}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-gray-400">Prioridade:</span>
            <span className="ml-2 text-cyan-400">{ticket.prioridade}</span>
          </div>
          <div>
            <span className="text-gray-400">Criado em:</span>
            <span className="ml-2 text-cyan-400">{new Date(ticket.criado_em).toLocaleDateString('pt-BR')}</span>
          </div>
          <div>
            <span className="text-gray-400">Última atualização:</span>
            <span className="ml-2 text-cyan-400">{new Date(ticket.atualizado_em).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Conversa</h2>
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">Nenhuma mensagem ainda</div>
        ) : (
          <div className="space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className="p-4 rounded border border-cyan-500/20 bg-gray-900/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-cyan-400">{msg.autor_id}</span>
                  <span className="text-xs text-gray-500">{new Date(msg.criado_em).toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-gray-300">{msg.mensagem}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulário de Nova Mensagem */}
      <form onSubmit={handleSendMessage} className="space-y-3">
        {error && (
          <div className="p-3 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}
        <textarea
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Digite sua resposta..."
          rows={4}
          className="w-full px-4 py-2 rounded bg-gray-900/50 border border-cyan-500/20 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none resize-none"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-6 py-2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? 'Enviando...' : 'Enviar Resposta'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/suporte/meus-tickets')}
            className="px-6 py-2 rounded border border-cyan-500/20 text-gray-400 hover:border-cyan-500/50 hover:text-gray-300 transition-colors"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  )
}
