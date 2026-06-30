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
  { id: 'aberta', label: 'Aberta', color: 'bg-blue-100 border-blue-300' },
  { id: 'andamento', label: 'Em Andamento', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'pendente', label: 'Pendente', color: 'bg-orange-100 border-orange-300' },
  { id: 'concluida', label: 'Concluída', color: 'bg-green-100 border-green-300' },
]

const PRIORITY_COLORS: Record<string, string> = {
  baixa: 'bg-green-200 text-green-800',
  media: 'bg-blue-200 text-blue-800',
  alta: 'bg-orange-200 text-orange-800',
  urgente: 'bg-red-200 text-red-800',
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
      {STATUSES.map((status) => (
        <div
          key={status.id}
          className={`border-2 rounded-lg p-4 min-h-96 ${status.color}`}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(status.id)}
        >
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-sm">{status.label}</span>
            <span className="bg-white px-2 py-0.5 rounded text-xs font-bold text-gray-700">
              {ordersByStatus[status.id]?.length || 0}
            </span>
          </h3>

          <div className="space-y-3">
            {ordersByStatus[status.id]?.map((order) => (
              <div
                key={order.id}
                draggable
                onDragStart={() => handleDragStart(order)}
                className="bg-white rounded-lg p-4 cursor-move hover:shadow-md transition-shadow border border-gray-200 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <GripHorizontal className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  <button
                    onClick={() => onDeleteOrder?.(order.id)}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {order.titulo}
                </h4>

                <p className="text-xs text-gray-600 mb-3">{order.cliente}</p>

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
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {order.tecnico}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {ordersByStatus[status.id]?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-xs">Nenhuma ordem aqui</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
