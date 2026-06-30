'use client'

import React, { useState } from 'react'
import { GripHorizontal, Trash2 } from 'lucide-react'

export interface KanbanOrder {
  id: string
  titulo: string
  cliente: string
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  tecnico?: string
}

interface OrdersKanbanProps {
  orders: KanbanOrder[]
  onMoveOrder?: (orderId: string, newStatus: string) => void
  onDeleteOrder?: (orderId: string) => void
}

const STATUSES = [
  { id: 'aberta', label: 'Aberta', color: 'bg-slate-900/50 border-blue-500/30' },
  { id: 'andamento', label: 'Em Andamento', color: 'bg-slate-900/50 border-amber-500/30' },
  { id: 'pendente', label: 'Pendente', color: 'bg-slate-900/50 border-orange-500/30' },
  { id: 'concluida', label: 'Concluída', color: 'bg-slate-900/50 border-emerald-500/30' },
]

const PRIORITY_COLORS: Record<string, string> = {
  baixa: 'bg-emerald-500/20 text-emerald-400',
  media: 'bg-blue-500/20 text-blue-400',
  alta: 'bg-orange-500/20 text-orange-400',
  urgente: 'bg-red-500/20 text-red-400',
}

export function OrdersKanban({
  orders,
  onMoveOrder,
  onDeleteOrder,
}: OrdersKanbanProps) {
  const [draggedOrder, setDraggedOrder] = useState<KanbanOrder | null>(null)

  const handleDragStart = (order: KanbanOrder) => {
    setDraggedOrder(order)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: string) => {
    if (!draggedOrder) return
    onMoveOrder?.(draggedOrder.id, status)
    setDraggedOrder(null)
  }

  // Group orders by status
  const ordersByStatus: Record<string, KanbanOrder[]> = {}
  STATUSES.forEach((status) => {
    ordersByStatus[status.id] = orders.filter((o) => o.id.includes(status.id)) || []
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {STATUSES.map((status) => (
        <div
          key={status.id}
          className={`border-2 rounded-lg p-4 min-h-96 ${status.color}`}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(status.id)}
        >
          <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <span className="text-sm">{status.label}</span>
            <span className="bg-slate-800/50 px-2 py-0.5 rounded text-xs font-bold text-slate-300">
              {ordersByStatus[status.id]?.length || 0}
            </span>
          </h3>

          <div className="space-y-3">
            {ordersByStatus[status.id]?.map((order) => (
              <div
                key={order.id}
                draggable
                onDragStart={() => handleDragStart(order)}
                className="bg-slate-800/50 rounded-lg p-4 cursor-move hover:bg-slate-800 transition-all border border-slate-700/50 hover:border-slate-600/50 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <GripHorizontal className="w-4 h-4 text-slate-500 group-hover:text-slate-400" />
                  <button
                    onClick={() => onDeleteOrder?.(order.id)}
                    className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-semibold text-slate-100 text-sm mb-1">
                  {order.titulo}
                </h4>

                <p className="text-xs text-slate-400 mb-3">{order.cliente}</p>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      PRIORITY_COLORS[order.prioridade]
                    }`}
                  >
                    {order.prioridade.charAt(0).toUpperCase() +
                      order.prioridade.slice(1)}
                  </span>
                  {order.tecnico && (
                    <span className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded">
                      {order.tecnico}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {ordersByStatus[status.id]?.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p className="text-xs">Nenhuma ordem aqui</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
