'use client'

import { useEffect, useState } from 'react'

export type TaskStatus = 'pending' | 'running' | 'done'

export interface StartupTask {
  label: string
  doneLabel: string
}

const TASKS: StartupTask[] = [
  { label: 'Verificando licença',           doneLabel: 'Verificado'     },
  { label: 'Inicializando banco de dados',  doneLabel: 'Conectado'      },
  { label: 'Carregando módulos',            doneLabel: 'OK'             },
  { label: 'Carregando permissões',         doneLabel: 'OK'             },
  { label: 'Inicializando IA',              doneLabel: 'Online'         },
  { label: 'Preparando Dashboard',          doneLabel: 'Concluído'      },
  { label: 'Finalizando',                   doneLabel: 'Sistema pronto' },
]

interface LoadingTasksProps {
  activeIndex: number // which task is currently running (0-based); -1 = none started
}

export function LoadingTasks({ activeIndex }: LoadingTasksProps) {
  return (
    <ul className="flex flex-col gap-1.5 w-full" style={{ maxWidth: '280px' }}>
      {TASKS.map((task, i) => {
        const status: TaskStatus =
          i < activeIndex ? 'done' : i === activeIndex ? 'running' : 'pending'

        const isVisible = i <= activeIndex

        return (
          <li
            key={task.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(6px)',
              transition: `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`,
            }}
          >
            {/* Icon */}
            <span
              style={{
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {status === 'done' && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Concluído">
                  <circle cx="7" cy="7" r="6.5" stroke="#22C55E" strokeWidth="1" />
                  <path d="M4 7l2 2 4-4" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {status === 'running' && (
                <span
                  style={{
                    display: 'block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    border: '1.5px solid #9CA3AF',
                    borderTopColor: '#111827',
                    animation: 'spin 0.7s linear infinite',
                  }}
                />
              )}
              {status === 'pending' && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Pendente">
                  <circle cx="7" cy="7" r="6.5" stroke="#D1D5DB" strokeWidth="1" />
                </svg>
              )}
            </span>

            {/* Label */}
            <span
              style={{
                fontSize: '12px',
                fontWeight: status === 'done' ? 500 : 400,
                color: status === 'done' ? '#111827' : status === 'running' ? '#374151' : '#D1D5DB',
                transition: 'color 0.3s ease',
              }}
            >
              {status === 'done' ? `${task.doneLabel}` : task.label}
            </span>
          </li>
        )
      })}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </ul>
  )
}

export { TASKS }
