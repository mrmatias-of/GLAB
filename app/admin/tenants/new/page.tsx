'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

interface FormData {
  name: string
  email: string
  slug: string
  plan: 'free' | 'pro' | 'enterprise'
}

export default function NewTenantPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    slug: '',
    plan: 'free',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Gerar slug automaticamente a partir do nome
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validações
      if (!formData.name.trim()) {
        throw new Error('Tenant name is required')
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required')
      }
      if (!formData.slug.trim()) {
        throw new Error('Slug is required')
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Invalid email format')
      }

      // Validar slug
      const slugRegex = /^[a-z0-9-]+$/
      if (!slugRegex.test(formData.slug)) {
        throw new Error('Slug must contain only lowercase letters, numbers, and hyphens')
      }

      const response = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create tenant')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/tenants')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tenant')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/tenants"
          className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Tenants
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-100">Create New Tenant</h1>
        <p className="text-slate-400 mt-1">Set up a new customer workspace</p>
      </div>

      {/* Form */}
      {success ? (
        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-6 text-emerald-400">
          <h3 className="font-semibold">Tenant created successfully!</h3>
          <p className="text-sm mt-1">Redirecting to tenants list...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {/* Tenant Name */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tenant Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g., Acme Corporation"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              required
            />
            <p className="text-xs text-slate-500 mt-2">The name of the customer's workspace</p>
          </div>

          {/* Email */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Workspace Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., admin@acme.com"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              required
            />
            <p className="text-xs text-slate-500 mt-2">Primary email for this workspace</p>
          </div>

          {/* Slug */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Workspace Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{typeof window !== 'undefined' ? window.location.host : ''}/</span>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="workspace-slug"
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              URL-friendly identifier (auto-generated from name)
            </p>
          </div>

          {/* Plan */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Initial Plan
            </label>
            <select
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <p className="text-xs text-slate-500 mt-2">
              The subscription plan for this tenant
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isLoading ? 'Creating...' : 'Create Tenant'}
            </button>
            <Link
              href="/admin/tenants"
              className="px-6 py-2 bg-slate-700 text-slate-100 rounded font-medium hover:bg-slate-600 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
