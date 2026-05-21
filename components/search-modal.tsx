"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, X, ArrowRight, BookOpen, FileText, HelpCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { resolveSlugsBySynonym } from "@/lib/search-synonyms"

type SearchResult = {
  type: "curso" | "pagina" | "topico"
  title: string
  description: string
  href: string
  icon: typeof BookOpen
}

const staticPages: SearchResult[] = [
  { type: "pagina", title: "Inicio", description: "Pagina principal do G-Lab", href: "/", icon: FileText },
  { type: "pagina", title: "Cursos", description: "Todos os guias mestre disponiveis", href: "/cursos", icon: BookOpen },
  { type: "pagina", title: "Contato", description: "Entre em contato conosco", href: "/contato", icon: HelpCircle },
  { type: "pagina", title: "Login", description: "Acesse sua conta", href: "/login", icon: FileText },
]

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("")
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
    const supabase = createClient()
    const searchLower = searchQuery.toLowerCase()

    // Resolver slugs via sinônimos
    const synonymSlugs = resolveSlugsBySynonym(searchQuery)

    // Busca direta + por sinônimo em paralelo
    const [{ data: cursosDiretos }, { data: allCursos }] = await Promise.all([
      supabase
        .from("cursos")
        .select("slug, titulo, descricao, modulos")
        .eq("ativo", true)
        .or(`titulo.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%,tag.ilike.%${searchQuery}%`)
        .limit(6),
      supabase
        .from("cursos")
        .select("slug, titulo, modulos")
        .eq("ativo", true),
    ])

    // Cursos encontrados por busca direta
    const cursoResults: SearchResult[] = (cursosDiretos || []).map((c: any) => ({
      type: "curso" as const,
      title: c.titulo,
      description: c.descricao?.substring(0, 80) + "..." || "",
      href: `/cursos/${c.slug}`,
      icon: BookOpen,
    }))

    // Cursos encontrados por sinônimo (que ainda não estão nos diretos)
    const slugsJaIncluidos = new Set(cursoResults.map(r => r.href))
    const synonymResults: SearchResult[] = (allCursos || [])
      .filter((c: any) => synonymSlugs.includes(c.slug) && !slugsJaIncluidos.has(`/cursos/${c.slug}`))
      .map((c: any) => ({
        type: "curso" as const,
        title: c.titulo,
        description: "Resultado relacionado à sua busca",
        href: `/cursos/${c.slug}`,
        icon: BookOpen,
      }))

    // Busca em módulos e tópicos
    const topicoResults: SearchResult[] = []
    ;(allCursos || []).forEach((curso: any) => {
      ;(curso.modulos || []).forEach((modulo: any) => {
        if (modulo.titulo?.toLowerCase().includes(searchLower)) {
          topicoResults.push({
            type: "topico",
            title: modulo.titulo,
            description: `Módulo do curso ${curso.titulo}`,
            href: `/cursos/${curso.slug}`,
            icon: FileText,
          })
        }
        ;(modulo.topicos || []).forEach((topico: string) => {
          if (topico.toLowerCase().includes(searchLower)) {
            topicoResults.push({
              type: "topico",
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
    setLoading(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery("")
      setResults(staticPages.slice(0, 4))
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const timer = setTimeout(() => searchCursos(query), 200)
    return () => clearTimeout(timer)
  }, [query, searchCursos])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === "Enter" && results[selectedIndex]) {
        router.push(results[selectedIndex].href)
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, results, selectedIndex, router, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl mx-4 bg-[#0a1018] border border-cyan/20 rounded-2xl shadow-2xl shadow-cyan/5 overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search size={20} className="text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Buscar cursos, topicos, paginas..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Buscando...
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado para &quot;{query}&quot;
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      isSelected 
                        ? "bg-cyan/10 border border-cyan/20" 
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-cyan/20 text-cyan" : "bg-white/5 text-muted-foreground"
                    }`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isSelected ? "text-foreground" : "text-foreground/80"}`}>
                        {result.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {result.description}
                      </p>
                    </div>
                    {isSelected && (
                      <ArrowRight size={14} className="text-cyan flex-shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-border font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-border font-mono text-[10px]">↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-border font-mono text-[10px]">Enter</kbd>
              abrir
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-border font-mono text-[10px]">Esc</kbd>
            fechar
          </span>
        </div>
      </div>
    </div>
  )
}
