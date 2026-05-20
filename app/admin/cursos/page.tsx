"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Plus, Pencil, ExternalLink, Trash2, Copy, ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react"

type Curso = {
  id: string
  slug: string
  tag: string
  titulo: string
  preco: string
  preco_original: string | null
  cta_href: string
  destaque: boolean
  ativo: boolean
  ordem: number
}

export default function AdminCursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  useEffect(() => {
    loadCursos()
  }, [])

  async function loadCursos() {
    const supabase = createClient()
    const { data } = await supabase.from("cursos").select("*").order("ordem")
    setCursos(data ?? [])
    setLoading(false)
  }

  async function handleDelete(id: string, titulo: string) {
    if (!confirm(`Tem certeza que deseja excluir "${titulo}"? Esta ação não pode ser desfeita.`)) return
    
    setActionLoading(id)
    const supabase = createClient()
    const { error } = await supabase.from("cursos").delete().eq("id", id)
    
    if (error) {
      alert("Erro ao excluir: " + error.message)
    } else {
      setCursos(cursos.filter(c => c.id !== id))
    }
    setActionLoading(null)
    setMenuOpen(null)
  }

  async function handleDuplicate(curso: Curso) {
    setActionLoading(curso.id)
    const supabase = createClient()
    
    // Buscar curso completo
    const { data: cursoCompleto } = await supabase
      .from("cursos")
      .select("*")
      .eq("id", curso.id)
      .single()
    
    if (!cursoCompleto) {
      alert("Erro ao duplicar curso")
      setActionLoading(null)
      return
    }

    // Criar cópia
    const { id, created_at, updated_at, ...cursoData } = cursoCompleto
    const { error } = await supabase.from("cursos").insert({
      ...cursoData,
      titulo: `${cursoData.titulo} (Cópia)`,
      slug: `${cursoData.slug}-copia-${Date.now()}`,
      ativo: false,
      ordem: (cursos.length + 1) * 10
    })

    if (error) {
      alert("Erro ao duplicar: " + error.message)
    } else {
      loadCursos()
    }
    setActionLoading(null)
    setMenuOpen(null)
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const index = cursos.findIndex(c => c.id === id)
    if (index === -1) return
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === cursos.length - 1) return

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newCursos = [...cursos]
    const [removed] = newCursos.splice(index, 1)
    newCursos.splice(newIndex, 0, removed)

    // Atualizar ordem no banco
    const supabase = createClient()
    for (let i = 0; i < newCursos.length; i++) {
      await supabase.from("cursos").update({ ordem: (i + 1) * 10 }).eq("id", newCursos[i].id)
    }

    setCursos(newCursos)
  }

  async function handleToggleAtivo(id: string, ativo: boolean) {
    setActionLoading(id)
    const supabase = createClient()
    const { error } = await supabase.from("cursos").update({ ativo: !ativo }).eq("id", id)
    
    if (!error) {
      setCursos(cursos.map(c => c.id === id ? { ...c, ativo: !ativo } : c))
    }
    setActionLoading(null)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground">Guias / Cursos</h1>
          <p className="text-muted-foreground text-sm mt-1">{cursos.length} guia(s) cadastrado(s)</p>
        </div>
        <Link
          href="/admin/cursos/novo"
          className="inline-flex items-center gap-2 bg-cyan text-background font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-cyan/90 shadow-[0_0_20px_rgba(0,212,200,0.25)] transition-all"
        >
          <Plus size={15} />
          Novo Guia
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-4 w-10">Ordem</th>
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-4">Guia</th>
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-4">Preço</th>
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-4">Checkout</th>
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-4">Status</th>
              <th className="text-right text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cursos.map((curso, index) => (
              <tr key={curso.id} className="hover:bg-surface-hover transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleReorder(curso.id, "up")}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => handleReorder(curso.id, "down")}
                      disabled={index === cursos.length - 1}
                      className="p-1 rounded hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleAtivo(curso.id, curso.ativo)}
                      disabled={actionLoading === curso.id}
                      className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${curso.ativo ? "bg-cyan" : "bg-muted-foreground"}`}
                      title={curso.ativo ? "Clique para desativar" : "Clique para ativar"}
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{curso.titulo}</p>
                      <p className="text-xs text-muted-foreground">{curso.tag} · /{curso.slug}</p>
                    </div>
                    {curso.destaque && (
                      <span className="text-[10px] font-black bg-cyan/15 text-cyan border border-cyan/20 px-2 py-0.5 rounded-full">
                        DESTAQUE
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-cyan">{curso.preco}</span>
                  {curso.preco_original && (
                    <span className="text-xs text-muted-foreground line-through ml-2">{curso.preco_original}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {curso.cta_href && curso.cta_href !== "#" ? (
                    <a
                      href={curso.cta_href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-green-400 hover:text-green-300 transition-colors"
                    >
                      <ExternalLink size={12} />
                      Configurado
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sem link</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${curso.ativo ? "bg-green-400/10 text-green-400" : "bg-muted text-muted-foreground"}`}>
                    {curso.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/cursos/editar/${curso.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-cyan border border-border hover:border-cyan/30 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Pencil size={12} />
                      Editar
                    </Link>
                    
                    {/* Menu de mais ações */}
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === curso.id ? null : curso.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-all"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      
                      {menuOpen === curso.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                          <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                            <button
                              onClick={() => handleDuplicate(curso)}
                              disabled={actionLoading === curso.id}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                            >
                              <Copy size={14} />
                              Duplicar
                            </button>
                            <button
                              onClick={() => handleDelete(curso.id, curso.titulo)}
                              disabled={actionLoading === curso.id}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                            >
                              <Trash2 size={14} />
                              Excluir
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {cursos.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum guia cadastrado ainda.</p>
            <Link
              href="/admin/cursos/novo"
              className="inline-flex items-center gap-2 bg-cyan text-background font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-cyan/90 transition-all"
            >
              <Plus size={15} />
              Criar Primeiro Guia
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
