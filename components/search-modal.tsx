'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight, BookOpen, FileText, HelpCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { resolveSlugsBySynonym } from '@/lib/search-synonyms'

type SearchResult = {
  type: 'curso' | 'pagina' | 'topico'
  title: string
  description: string
  href: string
  icon: typeof BookOpen
}

const staticPages: SearchResult[] = [
  { type: 'pagina', title: 'Início', description: 'Página principal do G-Lab', href: '/', icon: FileText },
  { type: 'pagina', title: 'Cursos', description: 'Todos os guias mestre disponíveis', href: '/cursos', icon: BookOpen },
  { type: 'pagina', title: 'Contato', description: 'Entre em contato conosco', href: '/contato', icon: HelpCircle },
  { type: 'pagina', title: 'Login', description: 'Acesse sua conta', href: '/login', icon: FileText },
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
      setResults(staticPages.slice(0, 4))
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const searchLower = searchQuery.toLowerCase()

      // Resolver slugs via sinônimos
      const synonymSlugs = resolveSlugsBySynonym(searchQuery)

      // Busca direta + por sinônimo em paralelo
      const [{ data: cursosDiretos }, { data: allCursos }] = await Promise.all([
        supabase
          .from('cursos')
          .select('slug, titulo, descricao, modulos')
          .eq('ativo', true)
          .or(`titulo.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%,tag.ilike.%${searchQuery}%`)
          .limit(6),
        supabase
          .from('cursos')
          .select('slug, titulo, modulos')
          .eq('ativo', true),
      ])

      // Cursos encontrados por busca direta
      const cursoResults: SearchResult[] = (cursosDiretos || []).map((c: any) => ({
        type: 'curso' as const,
        title: c.titulo,
        description: c.descricao?.substring(0, 80) + '...' || '',
        href: `/cursos/${c.slug}`,
        icon: BookOpen,
      }))

      // Cursos encontrados por sinônimo (que ainda não estão nos diretos)
      const slugsJaIncluidos = new Set(cursoResults.map(r => r.href))
      const synonymResults: SearchResult[] = (allCursos || [])
        .filter((c: any) => synonymSlugs.includes(c.slug) && !slugsJaIncluidos.has(`/cursos/${c.slug}`))
        .map((c: any) => ({
          type: 'curso' as const,
          title: c.titulo,
          description: 'Resultado relacionado à sua busca',
          href: `/cursos/${c.slug}`,
          icon: BookOpen,
        }))

      // Busca em módulos e tópicos
      const topicoResults: SearchResult[] = []
      ;(allCursos || []).forEach((curso: any) => {
        ;(curso.modulos || []).forEach((modulo: any) => {
          if (modulo.titulo?.toLowerCase().includes(searchLower)) {
            topicoResults.push({
              type: 'topico',
              title: modulo.titulo,
              description: `Módulo do curso ${curso.titulo}`,
              href: `/cursos/${curso.slug}`,
              icon: FileText,
            })
          }
          ;(modulo.topicos || []).forEach((topico: string) => {
            if (topico.toLowerCase().includes(searchLower)) {
              topicoResults.push({
                type: 'topico',
                title: topico,
                description: `${modulo.titulo} — ${curso.titulo}`,
                href: `/cursos/${curso.slug}`,
                icon: FileText,
              })
            }
          })
        })
      })

      const pageResults = staticPages.filter(
        p => p.title.toLowerCase().includes(searchLower) ||
             p.description.toLowerCase().includes(searchLower)
      )

      const allResults = [...cursoResults, ...synonymResults, ...topicoResults.slice(0, 3), ...pageResults]
      const uniqueResults = allResults
        .filter((r, i, arr) => arr.findIndex(x => x.href === r.href && x.title === r.title) === i)
        .slice(0, 8)

      setResults(uniqueResults)
    } catch (error) {
      console.error('[v0] Search error:', error)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery('')
      setResults(staticPages.slice(0, 4))
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const timer = setTimeout(() => searchCursos(query), 200)
    return () => clearTimeout(timer)
  }, [query, searchCursos])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] md:pt-[15vh] px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: '#111113',
          border: '1px solid #27272a',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div 
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: '1px solid #27272a' }}
        >
          <Search size={20} style={{ color: '#52525b', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Buscar cursos, tópicos, páginas..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{
              color: '#ffffff',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose()
              else if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex(i => Math.min(i + 1, results.length - 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex(i => Math.max(i - 1, 0))
              } else if (e.key === 'Enter' && results[selectedIndex]) {
                router.push(results[selectedIndex].href)
                onClose()
              }
            }}
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{
              color: '#52525b',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#27272a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] md:max-h-[50vh] overflow-y-auto p-2">
          {loading ? (
            <div className="px-4 py-8 text-center text-sm" style={{ color: '#52525b' }}>
              Buscando...
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm" style={{ color: '#52525b' }}>
              Nenhum resultado para &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result, index) => {
                const Icon = result.icon
                const isSelected = index === selectedIndex
                return (
                  <button
                    key={`${result.href}-${result.title}-${index}`}
                    onClick={() => {
                      router.push(result.href)
                      onClose()
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                    style={{
                      backgroundColor: isSelected ? '#1e1b4b' : 'transparent',
                      border: isSelected ? '1px solid #4f46e5' : '1px solid transparent',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: isSelected ? '#27272a' : '#18181b',
                        color: isSelected ? '#4f46e5' : '#52525b',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p 
                        className="text-sm font-semibold truncate"
                        style={{ color: isSelected ? '#ffffff' : '#a1a1aa' }}
                      >
                        {result.title}
                      </p>
                      <p className="text-xs truncate" style={{ color: '#52525b' }}>
                        {result.description}
                      </p>
                    </div>
                    {isSelected && (
                      <ArrowRight size={14} style={{ color: '#4f46e5', flexShrink: 0 }} />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="hidden md:flex px-4 py-3 items-center justify-between text-xs"
          style={{ borderTop: '1px solid #27272a', color: '#52525b' }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]">↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]">Enter</kbd>
              abrir
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]">Esc</kbd>
            fechar
          </span>
        </div>
      </div>
    </div>
  )
}
