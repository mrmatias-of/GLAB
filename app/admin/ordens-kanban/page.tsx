'use client'

import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import { OrdersKanban, KanbanOrder } from '@/components/orders/orders-kanban'
import { Plus } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function OrdersKanbanPage() {
  const { data: response, isLoading, error } = useSWR(
    '/api/ordens',
    fetcher,
    { revalidateOnFocus: false }
  )

  const [orders, setOrders] = useState<KanbanOrder[]>([])

  useEffect(() => {
    if (response?.data) {
      const mappedOrders: KanbanOrder[] = response.data.map((order: any) => ({
        id: order.id,
        titulo: order.numero + ' - ' + order.descricao,
        cliente: order.clienteNome || 'Sem cliente',
        prioridade: 'media' as const,
        tecnico: order.tecnicoNome,
      }))
      setOrders(mappedOrders)
    }
  }, [response])

  const handleMoveOrder = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id.startsWith(orderId.split('-')[0])
          ? { ...order, id: `${newStatus}-${Date.now()}` }
          : order
      )
    )
  }

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId))
  }

  if (isLoading) {
    return (
      <main className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Carregando ordens...</div>
      </main>
    )
  }

  if (error || !response?.success) {
    return (
      <main className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center">
        <div className="text-red-400">Erro ao carregar ordens</div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-auto bg-slate-950">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Quadro Kanban</h1>
            <p className="text-slate-400 mt-2">
              Arraste as ordens entre os estágios para atualizar seu status
            </p>
          </div>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 w-fit">
            <Plus className="w-5 h-5" />
            Nova Ordem
          </button>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto">
          <OrdersKanban
            orders={orders}
            onMoveOrder={handleMoveOrder}
            onDeleteOrder={handleDeleteOrder}
          />
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-4 hover:border-slate-600 transition-colors">
            <p className="text-xs font-medium text-slate-400 uppercase">Total de Ordens</p>
            <p className="text-2xl font-bold text-slate-100 mt-2">{orders.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-4 hover:border-slate-600 transition-colors">
            <p className="text-xs font-medium text-slate-400 uppercase">Em Andamento</p>
            <p className="text-2xl font-bold text-blue-400 mt-2">
              {orders.filter((o) => o.id.includes('andamento')).length}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-4 hover:border-slate-600 transition-colors">
            <p className="text-xs font-medium text-slate-400 uppercase">Pendentes</p>
            <p className="text-2xl font-bold text-amber-400 mt-2">
              {orders.filter((o) => o.id.includes('pendente')).length}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-4 hover:border-slate-600 transition-colors">
            <p className="text-xs font-medium text-slate-400 uppercase">Concluídas</p>
            <p className="text-2xl font-bold text-emerald-400 mt-2">
              {orders.filter((o) => o.id.includes('concluida')).length}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
