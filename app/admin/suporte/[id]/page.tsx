'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface Ticket {
  id: number
  titulo: string
  descricao: string
  status: string
  prioridade: string
  criado_em: string
  usuario_id: string
  responsavel_id?: string
}

interface Message {
  id: number
  autor_id: string
  mensagem: string
  criado_em: string
}

export default function AdminTicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const ticketId = params?.id as string

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  const [changes, setChanges] = useState<Partial<Ticket>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        setUser(user)

        // Buscar ticket
        const ticketResponse = await fetch(`/api/support/tickets/${ticketId}`)
        if (!ticketResponse.ok) throw new Error('Ticket não encontrado')
        const ticketData = await ticketResponse.json()
        setTicket(ticketData)

        // Buscar mensagens
        const messagesResponse = await fetch(`/api/support/tickets/${ticketId}/messages`)
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json()
          setMessages(messagesData)
        }
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }

    if (ticketId) fetchData()
  }, [ticketId, supabase, router])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !ticket) return

    setSaving(true)
    try {
      const response = await fetch(`/api/support/tickets/${ticket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: newMessage }),
      })

      if (!response.ok) throw new Error('Erro ao enviar')
      const message = await response.json()
      setMessages([...messages, message])
      setNewMessage('')
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveChanges = async () => {
    if (!ticket || Object.keys(changes).length === 0) return

    setSaving(true)
    try {
      const response = await fetch(`/api/support/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      })

      if (!response.ok) throw new Error('Erro ao atualizar')
      const updated = await response.json()
      setTicket(updated)
      setChanges({})
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-8 text-gray-400">Carregando...</div>
  if (!ticket) return <div className="text-center py-8 text-red-400">Ticket não encontrado</div>

  const statusColor = {
    aberto: 'text-blue-400 bg-blue-500/20',
    em_andamento: 'text-yellow-400 bg-yellow-500/20',
    resolvido: 'text-green-400 bg-green-500/20',
    fechado: 'text-gray-400 bg-gray-500/20',
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="p-6 rounded border border-cyan-500/20 bg-cyan-500/5">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">#{ticket.id} - {ticket.titulo}</h1>
          <span className={`px-3 py-1 rounded text-sm font-medium ${statusColor[ticket.status as keyof typeof statusColor]}`}>
            {ticket.status.replace('_', ' ')}
          </span>
        </div>
        <p className="text-gray-300 mb-4">{ticket.descricao}</p>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <select
              value={changes.status || ticket.status}
              onChange={e => setChanges({...changes, status: e.target.value})}
              className="w-full px-3 py-2 rounded bg-gray-900/50 border border-cyan-500/20 text-white"
            >
              <option value="aberto">Aberto</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="resolvido">Resolvido</option>
              <option value="fechado">Fechado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Prioridade</label>
            <select
              value={changes.prioridade || ticket.prioridade}
              onChange={e => setChanges({...changes, prioridade: e.target.value})}
              className="w-full px-3 py-2 rounded bg-gray-900/50 border border-cyan-500/20 text-white"
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
        </div>

        {Object.keys(changes).length > 0 && (
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="px-4 py-2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Conversa</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
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
      </div>

      {/* New Message */}
      <form onSubmit={handleSendMessage} className="space-y-3">
        <textarea
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Adicione uma resposta..."
          rows={4}
          className="w-full px-4 py-2 rounded bg-gray-900/50 border border-cyan-500/20 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none resize-none"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving || !newMessage.trim()}
            className="px-6 py-2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Enviando...' : 'Enviar Resposta'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded border border-cyan-500/20 text-gray-400 hover:border-cyan-500/50 hover:text-gray-300"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  )
}
