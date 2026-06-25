'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: number
  nome: string
  descricao?: string
  ordem: number
}

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user?.user_metadata?.is_admin) {
          router.push('/suporte/meus-tickets')
          return
        }
        setIsAdmin(true)

        const response = await fetch('/api/support/categories')
        if (!response.ok) throw new Error('Erro ao carregar')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, router])

  if (!isAdmin) return null

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Categorias de Suporte</h2>
        <p className="text-gray-400">Gerencie as categorias de tickets</p>
      </div>

      <div className="border border-cyan-500/20 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-500/20 bg-cyan-500/5">
                <th className="px-4 py-3 text-left text-sm font-semibold text-cyan-400">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-cyan-400">Descrição</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-cyan-400">Ordem</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                    Carregando...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                    Nenhuma categoria encontrada
                  </td>
                </tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                    <td className="px-4 py-3 text-sm text-gray-300">{cat.nome}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{cat.descricao || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{cat.ordem}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Nota: As categorias foram criadas automaticamente. Para adicionar mais, entre em contato com o desenvolvedor.
      </p>
    </div>
  )
}
