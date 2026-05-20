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
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-3">
            <Receipt className="text-cyan" size={28} />
            Vendas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {purchases.length} vendas registradas
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Aprovado</p>
          <p className="text-2xl font-black text-green-400 mt-1">
            R$ {totalAprovado.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Pendente</p>
          <p className="text-2xl font-black text-yellow-400 mt-1">
            R$ {totalPendente.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Aprovadas</p>
          <p className="text-2xl font-black text-foreground mt-1">
            {purchases.filter(p => p.status === "approved").length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Este Mês</p>
          <p className="text-2xl font-black text-foreground mt-1">
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
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por email, curso ou pedido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-cyan/50 transition-all"
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
          <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredPurchases.length === 0 ? (
        <div className="text-center py-20">
          <Receipt size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            {search || statusFilter !== "all" ? "Nenhuma venda encontrada" : "Nenhuma venda registrada ainda"}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Cliente</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Curso</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Valor</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((purchase) => {
                  const status = statusConfig[purchase.status] || statusConfig.pending
                  const StatusIcon = status.icon
                  return (
                    <tr key={purchase.id} className="border-b border-border last:border-0 hover:bg-surface/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center text-cyan text-xs font-bold">
                            {(purchase.email_comprador || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {purchase.profiles?.nome || "Sem nome"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {purchase.email_comprador}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 text-sm text-foreground">
                          <BookOpen size={14} className="text-cyan" />
                          {purchase.cursos?.titulo || "Curso"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-foreground">
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
                        <span className="text-sm text-muted-foreground">
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
