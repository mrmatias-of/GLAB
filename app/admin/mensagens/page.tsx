"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Mail, Trash2, Check, Clock, User } from "lucide-react"

type Mensagem = {
  id: string
  nome: string
  email: string
  mensagem: string
  lida: boolean
  created_at: string
}

export default function AdminMensagensPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Mensagem | null>(null)

  useEffect(() => {
    loadMensagens()
  }, [])

  async function loadMensagens() {
    const supabase = createClient()
    const { data } = await supabase
      .from("mensagens")
      .select("*")
      .order("created_at", { ascending: false })
    setMensagens(data ?? [])
    setLoading(false)
  }

  async function handleMarkRead(id: string) {
    const supabase = createClient()
    await supabase.from("mensagens").update({ lida: true }).eq("id", id)
    setMensagens(mensagens.map(m => m.id === id ? { ...m, lida: true } : m))
    if (selected?.id === id) {
      setSelected({ ...selected, lida: true })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta mensagem?")) return
    
    const supabase = createClient()
    await supabase.from("mensagens").delete().eq("id", id)
    setMensagens(mensagens.filter(m => m.id !== id))
    if (selected?.id === id) {
      setSelected(null)
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const naoLidas = mensagens.filter(m => !m.lida).length

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground">Mensagens</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {mensagens.length} mensagem(ns) · {naoLidas} não lida(s)
        </p>
      </div>

      <div className="grid lg:grid-cols-[350px_1fr] gap-6">
        {/* Lista de mensagens */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Mail size={14} />
              Caixa de Entrada
            </div>
          </div>
          
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {mensagens.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Nenhuma mensagem recebida ainda.
              </div>
            ) : (
              mensagens.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelected(m)
                    if (!m.lida) handleMarkRead(m.id)
                  }}
                  className={`w-full text-left p-4 hover:bg-surface-hover transition-colors ${
                    selected?.id === m.id ? "bg-surface-hover" : ""
                  } ${!m.lida ? "bg-cyan/5" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!m.lida ? "bg-cyan" : "bg-muted"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className={`text-sm truncate ${!m.lida ? "font-bold text-foreground" : "text-foreground/80"}`}>
                          {m.nome}
                        </p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatDate(m.created_at).split(",")[0]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1">{m.mensagem}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detalhes da mensagem */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {selected ? (
            <>
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan/15 border border-cyan/30 flex items-center justify-center">
                    <User size={18} className="text-cyan" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{selected.nome}</p>
                    <a href={`mailto:${selected.email}`} className="text-sm text-cyan hover:underline">
                      {selected.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!selected.lida && (
                    <button
                      onClick={() => handleMarkRead(selected.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-green-400 hover:bg-green-400/10 transition-all"
                      title="Marcar como lida"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                  <Clock size={12} />
                  {formatDate(selected.created_at)}
                  {selected.lida && (
                    <span className="ml-2 inline-flex items-center gap-1 text-green-400">
                      <Check size={12} /> Lida
                    </span>
                  )}
                </div>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {selected.mensagem}
                </p>
              </div>
              <div className="p-6 border-t border-border">
                <a
                  href={`mailto:${selected.email}?subject=Re: Mensagem G•Lab Cursos`}
                  className="inline-flex items-center gap-2 bg-cyan text-background font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-cyan/90 transition-all"
                >
                  <Mail size={14} />
                  Responder por Email
                </a>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground text-sm">
              Selecione uma mensagem para visualizar
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
