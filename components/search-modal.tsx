'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight, BookOpen, FileText } from 'lucide-react'

type SearchResult = {
  type: 'curso' | 'pagina'
  title: string
  description: string
  href: string
  icon: typeof BookOpen
}

const staticPages: SearchResult[] = [
  { type: 'pagina', title: 'Início', description: 'Página principal do G-Lab', href: '/', icon: FileText },
  { type: 'pagina', title: 'Cursos', description: 'Todos os guias mestre disponíveis', href: '/cursos', icon: BookOpen },
]

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const searchCursos = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(staticPages)
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const searchLower = searchQuery.toLowerCase()

      const { data: cursos } = await supabase
        .from('cursos')
        .select('slug, titulo, descricao')
        .eq('ativo', true)
        .or(`titulo.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%`)
        .limit(10)

      const cursoResults: SearchResult[] = (cursos || []).map((c: any) => ({
        type: 'curso' as const,
        title: c.titulo,
        description: c.descricao?.substring(0, 80) + '...' || '',
        href: `/cursos/${c.slug}`,
        icon: BookOpen,
      }))

      setResults([...staticPages, ...cursoResults])
    } catch (error) {
      console.error('Erro ao buscar cursos:', error)
      setResults(staticPages)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return

    inputRef.current?.focus()
    setSelectedIndex(0)
    searchCursos(query)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % results.length)
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
      }
      if (e.key === 'Enter' && results[selectedIndex]) {
        router.push(results[selectedIndex].href)
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, query, results, selectedIndex, router, onClose, searchCursos])

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-2xl mx-auto mt-12 px-4">
          <div
            className="rounded-2xl border border-[#27272a] shadow-2xl"
            style={{ backgroundColor: '#0B0B0C' }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#27272a]">
              <Search size={18} style={{ color: '#818cf8' }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar cursos..."
                value={query}
                onChange={e => {
                  setQuery(e.target.value)
                  searchCursos(e.target.value)
                }}
                className="flex-1 bg-transparent outline-none text-white placeholder-[#71717a]"
              />
              <button onClick={onClose} className="p-1 hover:bg-[#27272a] rounded">
                <X size={18} style={{ color: '#71717a' }} />
              </button>
            </div>

            {results.length > 0 && (
              <div className="max-h-96 overflow-y-auto">
                {results.map((result, i) => (
                  <button
                    key={`${result.type}-${result.href}`}
                    onClick={() => {
                      router.push(result.href)
                      onClose()
                    }}
                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-[#27272a] transition-colors text-left border-b border-[#27272a] last:border-b-0"
                    style={{
                      backgroundColor: selectedIndex === i ? '#1a1a1d' : 'transparent',
                    }}
                  >
                    <result.icon size={18} style={{ color: '#818cf8', marginTop: 2 }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{result.title}</p>
                      <p className="text-sm text-[#71717a] truncate">{result.description}</p>
                    </div>
                    {selectedIndex === i && <ArrowRight size={16} style={{ color: '#818cf8' }} />}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="px-4 py-8 text-center text-[#71717a]">Buscando cursos...</div>
            )}

            {!loading && query && results.length === 1 && (
              <div className="px-4 py-8 text-center text-[#71717a]">Nenhum curso encontrado</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
