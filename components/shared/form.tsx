'use client'

import { useState } from 'react'

export interface FormField {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'textarea' | 'select'
  placeholder?: string
  required?: boolean
  value?: string | number
  options?: { label: string; value: string | number }[]
  rows?: number
  min?: number
  max?: number
}

interface FormProps {
  fields: FormField[]
  initialValues?: Record<string, any>
  onSubmit: (values: Record<string, any>) => Promise<void> | void
  submitText?: string
  loading?: boolean
  onCancel?: () => void
}

export function Form({
  fields,
  initialValues = {},
  onSubmit,
  submitText = 'Salvar',
  loading = false,
  onCancel,
}: FormProps) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    fields.forEach((field) => {
      if (field.required && !values[field.name]) {
        newErrors[field.name] = `${field.label} é obrigatório`
      }
      if (field.type === 'email' && values[field.name]) {
        const email = String(values[field.name])
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          newErrors[field.name] = 'Email inválido'
        }
      }
    })
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    try {
      setIsSubmitting(true)
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              name={field.name}
              placeholder={field.placeholder}
              value={values[field.name] || ''}
              onChange={handleChange}
              rows={field.rows || 4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : field.type === 'select' ? (
            <select
              name={field.name}
              value={values[field.name] || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || 'text'}
              name={field.name}
              placeholder={field.placeholder}
              value={values[field.name] || ''}
              onChange={handleChange}
              min={field.min}
              max={field.max}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {errors[field.name] && (
            <p className="text-sm text-red-600">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <div className="flex items-center justify-end gap-3 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isSubmitting || loading ? 'Salvando...' : submitText}
        </button>
      </div>
    </form>
  )
}
