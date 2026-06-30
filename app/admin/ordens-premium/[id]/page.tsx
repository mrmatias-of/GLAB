'use client'

import React, { useState } from 'react'
import { OrderChecklist, ChecklistItem } from '@/components/orders/order-checklist'
import { SignaturePad } from '@/components/orders/signature-pad'
import { ExecutionTimer } from '@/components/orders/execution-timer'
import { OrderTimeline, TimelineEvent } from '@/components/orders/order-timeline'
import { generateId } from '@/lib/utils'

// Mock order data
const mockOrder = {
  id: '1',
  numero: '#OS-2024-001',
  cliente: 'João Silva',
  equipamento: 'Ar Condicionado Split',
  endereco: 'Rua A, 123 - São Paulo',
  tecnico: 'Pedro Santos',
  prioridade: 'alta',
  status: 'andamento',
  dataAbertura: new Date(2024, 5, 20),
  dataVencimento: new Date(2024, 6, 1),
  descricao: 'Manutenção e limpeza do ar condicionado',
  valor: 250.0,
}

// Mock timeline events
const mockTimeline: TimelineEvent[] = [
  {
    id: '1',
    type: 'status_change',
    title: 'Ordem Aberta',
    description: 'Ordem de serviço foi criada',
    timestamp: new Date(2024, 5, 20, 10, 0),
    author: 'Sistema',
    icon: 'check',
  },
  {
    id: '2',
    type: 'assignment',
    title: 'Técnico Atribuído',
    description: 'Ordem foi atribuída a Pedro Santos',
    timestamp: new Date(2024, 5, 20, 14, 30),
    author: 'Admin',
    icon: 'check',
  },
  {
    id: '3',
    type: 'status_change',
    title: 'Em Andamento',
    description: 'Técnico iniciou a execução',
    timestamp: new Date(2024, 5, 21, 9, 0),
    author: 'Pedro Santos',
    icon: 'clock',
  },
]

export default function PremiumOrderDetailPage() {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: '1', text: 'Inspecionar equipamento', completed: true },
    { id: '2', text: 'Limpar filtros', completed: true },
    { id: '3', text: 'Verificar refrigerante', completed: false },
    { id: '4', text: 'Testar funcionamento', completed: false },
  ])

  const [executionTime, setExecutionTime] = useState(0)
  const [technicianSignature, setTechnicianSignature] = useState<string | null>(null)
  const [clientSignature, setClientSignature] = useState<string | null>(null)
  const [timeline, setTimeline] = useState(mockTimeline)

  const handleChecklistToggle = (id: string) => {
    setChecklistItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )

    // Add to timeline
    const newEvent: TimelineEvent = {
      id: generateId(),
      type: 'note',
      title: 'Item do checklist atualizado',
      description: checklistItems.find((i) => i.id === id)?.text || '',
      timestamp: new Date(),
      author: mockOrder.tecnico,
    }
    setTimeline((prev) => [newEvent, ...prev])
  }

  const handleChecklistAdd = (text: string) => {
    const newItem: ChecklistItem = {
      id: generateId(),
      text,
      completed: false,
    }
    setChecklistItems((items) => [...items, newItem])
  }

  const handleChecklistRemove = (id: string) => {
    setChecklistItems((items) => items.filter((item) => item.id !== id))
  }

  const handleTimeUpdate = (seconds: number) => {
    setExecutionTime(seconds)
  }

  const handleTechnicianSignature = (signature: string) => {
    setTechnicianSignature(signature)

    const newEvent: TimelineEvent = {
      id: generateId(),
      type: 'completion',
      title: 'Assinatura do Técnico',
      description: 'Técnico assinou a ordem de serviço',
      timestamp: new Date(),
      author: mockOrder.tecnico,
      icon: 'check',
    }
    setTimeline((prev) => [newEvent, ...prev])
  }

  const handleClientSignature = (signature: string) => {
    setClientSignature(signature)

    const newEvent: TimelineEvent = {
      id: generateId(),
      type: 'completion',
      title: 'Assinatura do Cliente',
      description: 'Cliente assinou a ordem de serviço',
      timestamp: new Date(),
      author: mockOrder.cliente,
      icon: 'check',
    }
    setTimeline((prev) => [newEvent, ...prev])
  }

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{mockOrder.numero}</h1>
              <p className="text-gray-600 mt-1">{mockOrder.cliente}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-lg font-medium text-sm">
                {mockOrder.status === 'andamento' ? 'Em Andamento' : mockOrder.status}
              </span>
            </div>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-lg border border-gray-200 p-4">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase">Equipamento</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {mockOrder.equipamento}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase">Técnico</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{mockOrder.tecnico}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase">Valor</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                R$ {mockOrder.valor.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase">Tempo</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {Math.floor(executionTime / 3600)}h {Math.floor((executionTime % 3600) / 60)}m
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Main Controls */}
          <div className="lg:col-span-2 space-y-6">
            <OrderChecklist
              items={checklistItems}
              onToggle={handleChecklistToggle}
              onAdd={handleChecklistAdd}
              onRemove={handleChecklistRemove}
            />

            <ExecutionTimer onTimeUpdate={handleTimeUpdate} initialSeconds={executionTime} />

            <SignaturePad
              onSignatureCapture={handleTechnicianSignature}
              signatureType="technician"
              readOnly={!!technicianSignature}
              existingSignature={technicianSignature || undefined}
            />

            <SignaturePad
              onSignatureCapture={handleClientSignature}
              signatureType="client"
              readOnly={!!clientSignature}
              existingSignature={clientSignature || undefined}
            />
          </div>

          {/* Right Column - Timeline */}
          <div>
            <OrderTimeline events={timeline} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
            Salvar Rascunho
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Finalizar Ordem
          </button>
        </div>
      </div>
    </main>
  )
}
