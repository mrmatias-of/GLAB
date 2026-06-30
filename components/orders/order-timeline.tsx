'use client'

import React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Check, Clock, AlertCircle } from 'lucide-react'

export interface TimelineEvent {
  id: string
  type: 'status_change' | 'note' | 'assignment' | 'completion'
  title: string
  description: string
  timestamp: Date
  author: string
  icon?: 'check' | 'clock' | 'alert'
}

interface OrderTimelineProps {
  events: TimelineEvent[]
}

export function OrderTimeline({ events }: OrderTimelineProps) {
  const getIcon = (type: TimelineEvent['type'], icon?: string) => {
    switch (icon) {
      case 'check':
        return <Check className="w-5 h-5 text-green-600" />
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case 'clock':
      default:
        return <Clock className="w-5 h-5 text-blue-600" />
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Histórico</h3>

      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-4">
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                {getIcon(event.type, event.icon)}
              </div>
              {index < events.length - 1 && (
                <div className="w-1 bg-gray-200 flex-1 my-2" style={{ minHeight: '3rem' }} />
              )}
            </div>

            {/* Event content */}
            <div className="flex-1 pt-2">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-semibold text-gray-900">{event.title}</h4>
                <span className="text-xs text-gray-500">
                  {format(event.timestamp, "dd 'de' MMMM 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              <p className="text-xs text-gray-500">Por {event.author}</p>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Nenhum evento no histórico ainda</p>
        </div>
      )}
    </div>
  )
}
