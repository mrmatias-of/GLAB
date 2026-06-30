'use client'

import React, { useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

interface OrderChecklistProps {
  items: ChecklistItem[]
  onToggle: (id: string) => void
  onAdd: (text: string) => void
  onRemove: (id: string) => void
  editable?: boolean
}

export function OrderChecklist({
  items,
  onToggle,
  onAdd,
  onRemove,
  editable = true,
}: OrderChecklistProps) {
  const [newItem, setNewItem] = useState('')

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem)
      setNewItem('')
    }
  }

  const completedCount = items.filter((i) => i.completed).length
  const completionPercentage = items.length > 0 ? (completedCount / items.length) * 100 : 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Checklist</h3>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {completedCount}/{items.length}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <button
              onClick={() => onToggle(item.id)}
              className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                item.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {item.completed && <Check className="w-4 h-4 text-white" />}
            </button>
            <span
              className={`flex-1 ${
                item.completed ? 'text-gray-400 line-through' : 'text-gray-900'
              }`}
            >
              {item.text}
            </span>
            {editable && (
              <button
                onClick={() => onRemove(item.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {editable && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAdd()
            }}
            placeholder="Adicionar item..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      )}
    </div>
  )
}
