'use client'

import React, { useState } from 'react'
import { OrdersKanban, KanbanOrder } from '@/components/orders/orders-kanban'
import { Plus } from 'lucide-react'

const mockOrders: KanbanOrder[] = [
  {
    id: 'aberta-1',
    titulo: 'Manutenção Ar Condicionado',
    cliente: 'João Silva',
    prioridade: 'alta',
    tecnico: 'Pedro Santos',
  },
  {
    id: 'aberta-2',
    titulo: 'Reparo Geladeira',
    cliente: 'Maria Santos',
    prioridade: 'media',
  },
  {
    id: 'andamento-1',
    titulo: 'Instalação Ar Condicionado',
    cliente: 'Carlos Oliveira',
    prioridade: 'urgente',
    tecnico: 'João Silva',
  },
  {
    id: 'andamento-2',
    titulo: 'Limpeza Refrigerador',
    cliente: 'Ana Costa',
    prioridade: 'baixa',
    tecnico: 'Pedro Santos',
  },
  {
    id: 'pendente-1',
    titulo: 'Aguardando Peça',
    cliente: 'Roberto Lima',
    prioridade: 'alta',
    tecnico: 'João Silva',
  },
  {
    id: 'concluida-1',
    titulo: 'Limpeza Ar Condicionado',
    cliente: 'Fernanda Gomes',
    prioridade: 'media',
    tecnico: 'Pedro Santos',
  },
  {
    id: 'concluida-2',
    titulo: 'Reparo Fogão',
    cliente: 'Lucas Martins',
    prioridade: 'baixa',
    tecnico: 'João Silva',
  },
]

export default function OrdersKanbanPage() {
  const [orders, setOrders] = useState(mockOrders)

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

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quadro Kanban</h1>
            <p className="text-gray-600 mt-2">
              Arraste as ordens entre os estágios para atualizar seu status
            </p>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2">
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
        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-600 uppercase">Total de Ordens</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-600 uppercase">Em Andamento</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {orders.filter((o) => o.id.includes('andamento')).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-600 uppercase">Pendentes</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {orders.filter((o) => o.id.includes('pendente')).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-600 uppercase">Concluídas</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {orders.filter((o) => o.id.includes('concluida')).length}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
