'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XIcon } from 'lucide-react'

interface Tenant {
  id: string
  slug: string
  name: string
  email: string
  plan: string
  status: string
  createdAt: string
}

export default function TenantsManagementPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTenants()
  }, [])

  const fetchTenants = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/tenants')
      if (!response.ok) throw new Error('Failed to fetch tenants')
      const data = await response.json()
      setTenants(data.tenants || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tenants')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (tenantId: string) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return

    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete tenant')
      setTenants(tenants.filter(t => t.id !== tenantId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tenant')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Tenants</h1>
          <p className="text-slate-400 mt-1">Manage all customer workspaces</p>
        </div>
        <Link
          href="/admin/tenants/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <PlusIcon className="w-5 h-5" />
          New Tenant
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Total Tenants</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{tenants.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {tenants.filter(t => t.status === 'active').length}
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Suspended</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {tenants.filter(t => t.status === 'suspended').length}
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Pro Plans</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {tenants.filter(t => t.plan === 'pro').length}
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-slate-400">Loading tenants...</div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      ) : tenants.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-8 text-center">
          <p className="text-slate-400">No tenants yet. Create one to get started.</p>
          <Link
            href="/admin/tenants/new"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create First Tenant
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Plan</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Created</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(tenant => (
                <tr key={tenant.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/tenants/${tenant.id}`}
                      className="text-blue-400 hover:underline font-medium"
                    >
                      {tenant.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{tenant.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tenant.plan === 'pro'
                          ? 'bg-blue-500/20 text-blue-400'
                          : tenant.plan === 'enterprise'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {tenant.plan.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {tenant.status === 'active' ? (
                        <CheckIcon className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XIcon className="w-4 h-4 text-red-400" />
                      )}
                      <span
                        className={tenant.status === 'active' ? 'text-emerald-400' : 'text-red-400'}
                      >
                        {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/tenants/${tenant.id}/edit`}
                        className="p-2 hover:bg-slate-700 rounded transition"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4 text-slate-400" />
                      </Link>
                      <button
                        onClick={() => handleDelete(tenant.id)}
                        className="p-2 hover:bg-red-500/20 rounded transition"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
