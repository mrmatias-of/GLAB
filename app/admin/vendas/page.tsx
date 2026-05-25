"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Receipt, Search, Calendar, CreditCard, User, BookOpen, CheckCircle, XCircle, Clock } from "lucide-react"

type Purchase = {
  id: string
  user_id: string
  curso_id: string
  kiwify_order_id: string | null
  status: string
  valor: number | null
  metodo_pagamento: string | null
  email_comprador: string | null
  purchased_at: string
  cursos: { titulo: string } | null
  profiles: { nome: string | null; email: string } | null
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  approved: { label: "Aprovado", color: "text-green-400 bg-green-400/10", icon: CheckCircle },
  pending: { label: "Pendente", color: "text-yellow-400 bg-yellow-400/10", icon: Clock },
  refunded: { label: "Reembolsado", color: "text-red-400 bg-red-400/10", icon: XCircle },
  cancelled: { label: "Cancelado", color: "text-muted-foreground bg-muted-foreground/10", icon: XCircle },
}

export default function VendasPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const supabase = createClient()
    
    const { data } = await supabase
      .from("purchases")
      .select("*, cursos(titulo), profiles(nome, email)")
      .order("purchased_at", { ascending: false })

    if (data) {
      setPurchases(data as Purchase[])
    }
    setLoading(false)
  }

  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = 
      (p.email_comprador && p.email_comprador.toLowerCase().includes(search.toLowerCase())) ||
      (p.kiwify_order_id && p.kiwify_order_id.toLowerCase().includes(search.toLowerCase())) ||
      (p.cursos?.titulo && p.cursos.titulo.toLowerCase().includes(search.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const totalAprovado = purchases
    .filter(p => p.status === "approved")
    .reduce((acc, p) => acc + (p.valor || 0), 0)

  const totalPendente = purchases
    .filter(p => p.status === "pending")
    .reduce((acc, p) => acc + (p.valor || 0), 0)

  return (
    <div className="p-6 md:p-8" style={{ background: '#050510' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#00d4c8' }}>Financeiro</p>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Receipt style={{ color: '#00d4c8' }} size={28} />
            Vendas
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {purchases.length} vendas registradas
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div 
          className="rounded-xl border border-green-500/20 p-4 transition-all duration-300 hover:scale-105"
          style={{ background: 'rgba(74,222,128,0.05)' }}
        >
          <p className="text-xs text-white/40 uppercase tracking-wide">Total Aprovado</p>
          <p className="text-2xl font-black text-green-400 mt-1">
            R$ {totalAprovado.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div 
          className="rounded-xl border border-amber-500/20 p-4 transition-all duration-300 hover:scale-105"
          style={{ background: 'rgba(245,158,11,0.05)' }}
        >
          <p className="text-xs text-white/40 uppercase tracking-wide">Pendente</p>
          <p className="text-2xl font-black text-amber-400 mt-1">
            R$ {totalPendente.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div 
          className="rounded-xl border border-cyan-500/20 p-4 transition-all duration-300 hover:scale-105"
          style={{ background: 'rgba(0,212,200,0.05)' }}
        >
          <p className="text-xs text-white/40 uppercase tracking-wide">Aprovadas</p>
          <p className="text-2xl font-black text-white mt-1">
            {purchases.filter(p => p.status === "approved").length}
          </p>
        </div>
        <div 
          className="rounded-xl border border-violet-500/20 p-4 transition-all duration-300 hover:scale-105"
          style={{ background: 'rgba(124,58,237,0.05)' }}
        >
          <p className="text-xs text-white/40 uppercase tracking-wide">Este Mês</p>
          <p className="text-2xl font-black text-white mt-1">
            {purchases.filter(p => {
              const date = new Date(p.purchased_at)
              const now = new Date()
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
            }).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Buscar por email, curso ou pedido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-cyan-500/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-all"
            style={{ background: 'rgba(0,212,200,0.02)' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-cyan-500/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
          style={{ background: '#0a0a14' }}
        >
          <option value="all">Todos os status</option>
          <option value="approved">Aprovados</option>
          <option value="pending">Pendentes</option>
          <option value="refunded">Reembolsados</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div 
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#00d4c8', borderTopColor: 'transparent' }}
          />
        </div>
      ) : filteredPurchases.length === 0 ? (
        <div className="text-center py-20">
          <Receipt size={48} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/40">
            {search || statusFilter !== "all" ? "Nenhuma venda encontrada" : "Nenhuma venda registrada ainda"}
          </p>
        </div>
      ) : (
        <div 
          className="rounded-xl border border-cyan-500/20 overflow-hidden"
          style={{ background: 'rgba(0,212,200,0.02)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/10">
                  <th className="text-left text-xs font-semibold uppercase tracking-wide px-4 py-3" style={{ color: 'rgba(0,212,200,0.5)' }}>Cliente</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide px-4 py-3" style={{ color: 'rgba(0,212,200,0.5)' }}>Curso</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide px-4 py-3" style={{ color: 'rgba(0,212,200,0.5)' }}>Valor</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide px-4 py-3" style={{ color: 'rgba(0,212,200,0.5)' }}>Status</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide px-4 py-3" style={{ color: 'rgba(0,212,200,0.5)' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((purchase) => {
                  const status = statusConfig[purchase.status] || statusConfig.pending
                  const StatusIcon = status.icon
                  return (
                    <tr key={purchase.id} className="border-b border-cyan-500/10 last:border-0 hover:bg-cyan-500/5 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: 'rgba(0,212,200,0.1)', color: '#00d4c8' }}
                          >
                            {(purchase.email_comprador || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {purchase.profiles?.nome || "Sem nome"}
                            </p>
                            <p className="text-xs text-white/30">
                              {purchase.email_comprador}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 text-sm text-white">
                          <BookOpen size={14} style={{ color: '#00d4c8' }} />
                          {purchase.cursos?.titulo || "Curso"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-white">
                          {purchase.valor ? `R$ ${purchase.valor.toFixed(2).replace(".", ",")}` : "-"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-white/40">
                          {new Date(purchase.purchased_at).toLocaleDateString("pt-BR")}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
