'use client'

import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onSubmit?: () => void
  submitText?: string
  submitDisabled?: boolean
  cancelText?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  onSubmit,
  submitText = 'Salvar',
  submitDisabled = false,
  cancelText = 'Cancelar',
}: ModalProps) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-slate-900 rounded-lg shadow-xl p-6 ${sizeClasses[size]} max-h-[90vh] overflow-y-auto border border-slate-700`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded transition text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">{children}</div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-800 transition"
          >
            {cancelText}
          </button>
          {onSubmit && (
            <button
              onClick={onSubmit}
              disabled={submitDisabled}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 transition"
            >
              {submitText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
