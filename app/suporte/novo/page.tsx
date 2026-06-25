'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: number
  nome: string
  descricao?: string
}

export default function NovoTicketPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria_id: '',
    prioridade: 'media',
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/support/categories')
        if (!response.ok) throw new Error('Erro ao carregar categorias')
        const data = await response.json()
        setCategories(data)
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, categoria_id: String(data[0].id) }))
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
        setError('Erro ao carregar categorias')
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: formData.titulo,
          descricao: formData.descricao,
          categoria_id: Number(formData.categoria_id),
          prioridade: formData.prioridade,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar ticket')
      }

      const ticket = await response.json()
      router.push(`/suporte/${ticket.id}`)
    } catch (error) {
      console.error('Erro ao criar ticket:', error)
      setError('Erro ao criar ticket. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Criar Novo Ticket</h2>
        <p className="text-gray-400">Descreva seu problema para que nossa equipe possa ajudar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded border border-red-500/30 bg-red-500/10 text-red-400">
            {error}
          </div>
        )}

        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-300 mb-2">
            Título do Ticket *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Descreva brevemente o problema"
            required
            className="w-full px-4 py-2 rounded bg-gray-900/50 border border-cyan-500/20 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
          />
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-300 mb-2">
            Descrição Detalhada *
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Forneça o máximo de detalhes possível sobre o problema"
            required
            rows={6}
            className="w-full px-4 py-2 rounded bg-gray-900/50 border border-cyan-500/20 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none resize-none"
          />
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-300 mb-2">
            Categoria *
          </label>
          <select
            id="categoria_id"
            name="categoria_id"
            value={formData.categoria_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-900/50 border border-cyan-500/20 text-white focus:border-cyan-500/50 focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Prioridade */}
        <div>
          <label htmlFor="prioridade" className="block text-sm font-medium text-gray-300 mb-2">
            Prioridade
          </label>
          <select
            id="prioridade"
            name="prioridade"
            value={formData.prioridade}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-900/50 border border-cyan-500/20 text-white focus:border-cyan-500/50 focus:outline-none"
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Criando...' : 'Criar Ticket'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded border border-cyan-500/20 text-gray-400 hover:border-cyan-500/50 hover:text-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
