'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TenantManagement() {
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gerenciamento de Tenants</h1>
            <p className="text-slate-600 mt-1">Visualize, crie e gerencie todas as empresas</p>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Novo Tenant
          </button>
        </div>

        {/* Tenants Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Slug</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Plano</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Criado em</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Nenhum tenant encontrado. Crie um novo para começar.
                  </td>
                </tr>
              ) : (
                tenants.map((tenant: any) => (
                  <tr key={tenant.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{tenant.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{tenant.slug}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">--</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">--</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button className="text-blue-600 hover:text-blue-700 font-medium">Editar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Link href="/master">
          <div className="mt-8 inline-block">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              ← Voltar para Master
            </button>
          </div>
        </Link>
      </div>
    </div>
  )
}
