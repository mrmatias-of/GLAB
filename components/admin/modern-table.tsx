'use client'

import React from 'react'

interface ModernTableProps {
  columns: { key: string; label: string; width?: string }[]
  data: Record<string, any>[]
  actions?: (row: Record<string, any>) => React.ReactNode
}

export function ModernTable({ columns, data, actions }: ModernTableProps) {
  return (
    <div className="rounded-lg border border-slate-700/50 overflow-hidden bg-slate-900/30">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-800/50 border-b border-slate-700/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Ações</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
              {columns.map((col) => (
                <td key={`${idx}-${col.key}`} className="px-6 py-4 text-sm text-slate-300">
                  {row[col.key]}
                </td>
              ))}
              {actions && <td className="px-6 py-4 text-sm">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
