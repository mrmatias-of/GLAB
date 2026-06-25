"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
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
    try {
      const response = await fetch('/api/admin/cursos')
      const data = await response.json()
      setCursos(data ?? [])
    } catch (error) {
      console.error('[v0] Erro ao carregar cursos:', error)
      alert('Erro ao carregar cursos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, titulo: string) {
    if (!confirm(`Tem certeza que deseja excluir "${titulo}"? Esta ação não pode ser desfeita.`)) return
    
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/cursos/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setCursos(cursos.filter(c => c.id !== id))
      } else {
        alert('Erro ao excluir curso')
      }
    } catch (error) {
      console.error('[v0] Erro ao excluir:', error)
      alert('Erro ao excluir curso')
    } finally {
      setActionLoading(null)
    }
    setMenuOpen(null)
  }

  async function handleDuplicate(curso: Curso) {
    setActionLoading(curso.id)
    try {
      const response = await fetch(`/api/admin/cursos/${curso.id}/duplicate`, { method: 'POST' })
      if (response.ok) {
        loadCursos()
      } else {
        alert('Erro ao duplicar curso')
      }
    } catch (error) {
      console.error('[v0] Erro ao duplicar:', error)
      alert('Erro ao duplicar curso')
    } finally {
      setActionLoading(null)
      setMenuOpen(null)
    }
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

    try {
      const response = await fetch('/api/admin/cursos/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCursos.map((c, i) => ({ id: c.id, ordem: (i + 1) * 10 })))
      })
      if (response.ok) {
        setCursos(newCursos)
      }
    } catch (error) {
      console.error('[v0] Erro ao reordenar:', error)
    }
  }

  async function handleToggleAtivo(id: string, ativo: boolean) {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/cursos/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !ativo })
      })
      if (response.ok) {
        setCursos(cursos.map(c => c.id === id ? { ...c, ativo: !ativo } : c))
      }
    } catch (error) {
      console.error('[v0] Erro ao atualizar:', error)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div 
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#00d4c8', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="p-8" style={{ background: '#050510' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#00d4c8' }}>Gerenciamento</p>
          <h1 className="text-2xl font-black text-white">Cursos</h1>
          <p className="text-white/40 text-sm mt-1">{cursos.length} curso(s) cadastrado(s)</p>
        </div>
        <Link
          href="/admin/cursos/novo"
          className="inline-flex items-center gap-2 text-black font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105"
          style={{ 
            background: 'linear-gradient(135deg, #00d4c8 0%, #7c3aed 100%)',
            boxShadow: '0 0 20px rgba(0,212,200,0.3)'
          }}
        >
          <Plus size={15} />
          Novo Curso
        </Link>
      </div>

      {/* Tabela */}
      <div 
        className="rounded-2xl border border-cyan-500/20 overflow-hidden"
        style={{ background: 'rgba(0,212,200,0.02)' }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-cyan-500/10">
              <th className="text-left text-xs font-bold uppercase tracking-wider px-6 py-4 w-10" style={{ color: 'rgba(0,212,200,0.5)' }}>Ordem</th>
              <th className="text-left text-xs font-bold uppercase tracking-wider px-6 py-4" style={{ color: 'rgba(0,212,200,0.5)' }}>Curso</th>
              <th className="text-left text-xs font-bold uppercase tracking-wider px-6 py-4" style={{ color: 'rgba(0,212,200,0.5)' }}>Preço</th>
              <th className="text-left text-xs font-bold uppercase tracking-wider px-6 py-4" style={{ color: 'rgba(0,212,200,0.5)' }}>Checkout</th>
              <th className="text-left text-xs font-bold uppercase tracking-wider px-6 py-4" style={{ color: 'rgba(0,212,200,0.5)' }}>Status</th>
              <th className="text-right text-xs font-bold uppercase tracking-wider px-6 py-4" style={{ color: 'rgba(0,212,200,0.5)' }}>Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/10">
            {cursos.map((curso, index) => (
              <tr key={curso.id} className="hover:bg-cyan-500/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleReorder(curso.id, "up")}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/30 hover:text-cyan-400 transition-colors"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => handleReorder(curso.id, "down")}
                      disabled={index === cursos.length - 1}
                      className="p-1 rounded hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/30 hover:text-cyan-400 transition-colors"
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
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors"
                      style={curso.ativo ? { background: 'linear-gradient(135deg, #00d4c8 0%, #7c3aed 100%)', boxShadow: '0 0 10px rgba(0,212,200,0.5)' } : { background: 'rgba(255,255,255,0.2)' }}
                      title={curso.ativo ? "Clique para desativar" : "Clique para ativar"}
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{curso.titulo}</p>
                      <p className="text-xs text-white/30">{curso.tag} · /{curso.slug}</p>
                    </div>
                    {curso.destaque && (
                      <span 
                        className="text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/30"
                        style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}
                      >
                        DESTAQUE
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold" style={{ color: '#00d4c8' }}>{curso.preco}</span>
                  {curso.preco_original && (
                    <span className="text-xs text-white/30 line-through ml-2">{curso.preco_original}</span>
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
                    <span className="text-xs text-white/30">Sem link</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span 
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={curso.ativo ? { background: 'rgba(74,222,128,0.1)', color: '#4ade80' } : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}
                  >
                    {curso.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/cursos/editar/${curso.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 px-3 py-1.5 rounded-lg transition-all hover:bg-cyan-500/5"
                    >
                      <Pencil size={12} />
                      Editar
                    </Link>
                    
                    {/* Menu de mais ações */}
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === curso.id ? null : curso.id)}
                        className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      
                      {menuOpen === curso.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                          <div 
                            className="absolute right-0 top-full mt-1 w-40 border border-cyan-500/20 rounded-xl shadow-lg z-20 py-1 overflow-hidden"
                            style={{ background: '#0a0a14' }}
                          >
                            <button
                              onClick={() => handleDuplicate(curso)}
                              disabled={actionLoading === curso.id}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-white hover:bg-cyan-500/5 transition-colors"
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
            <p className="text-white/40 mb-4">Nenhum curso cadastrado ainda.</p>
            <Link
              href="/admin/cursos/novo"
              className="inline-flex items-center gap-2 text-black font-bold text-sm px-5 py-2.5 rounded-xl transition-all"
              style={{ background: 'linear-gradient(135deg, #00d4c8 0%, #7c3aed 100%)' }}
            >
              <Plus size={15} />
              Criar Primeiro Curso
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
