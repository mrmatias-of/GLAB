'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Search, Plus, Trash2, Edit2 } from 'lucide-react'

interface Column<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onAdd?: () => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  searchPlaceholder?: string
  searchableFields?: (keyof T)[]
  itemsPerPage?: number
  title?: string
}

export function DataTable<T extends { id?: number | string }>(
  props: DataTableProps<T>
) {
  const {
    columns,
    data,
    loading,
    onAdd,
    onEdit,
    onDelete,
    searchPlaceholder = 'Pesquisar...',
    searchableFields = [],
    itemsPerPage = 10,
    title,
  } = props

  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  // Filter data
  const filtered = data.filter((item) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return searchableFields.some((field) => {
      const value = String(item[field] || '').toLowerCase()
      return value.includes(searchLower)
    })
  })

  // Sort data
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sorted.length / itemsPerPage)
  const start = (currentPage - 1) * itemsPerPage
  const paged = sorted.slice(start, start + itemsPerPage)

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
          />
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition transform hover:scale-105 font-medium"
          >
            <Plus className="w-4 h-4" />
            Novo
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 border-b border-slate-700">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable && toggleSort(col.key)}
                  className={`px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider ${
                    col.width || ''
                  } ${col.sortable ? 'cursor-pointer hover:text-cyan-400 transition' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-cyan-400 text-base">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-slate-400">
                  Carregando...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-slate-400">
                  Nenhum resultado encontrado
                </td>
              </tr>
            ) : (
              paged.map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition">
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-3.5 text-sm text-slate-300 ${col.width || ''}`}
                    >
                      {col.render ? col.render(item[col.key], item) : String(item[col.key] || '')}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="p-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-slate-400">
            Mostrando <span className="text-cyan-400 font-medium">{start + 1}-{Math.min(start + itemsPerPage, sorted.length)}</span> de <span className="text-cyan-400 font-medium">{sorted.length}</span> ({totalPages} páginas)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-slate-800 hover:text-cyan-400 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition text-slate-400"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-400 px-3">
              <span className="text-cyan-400 font-medium">{currentPage}</span> / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-slate-800 hover:text-cyan-400 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition text-slate-400"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
