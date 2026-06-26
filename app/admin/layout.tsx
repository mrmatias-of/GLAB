'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Ordens de Serviço', href: '/admin/ordens-servico', icon: '📋' },
  { name: 'Clientes', href: '/admin/clientes', icon: '👥' },
  { name: 'Técnicos', href: '/admin/tecnicos', icon: '🔧' },
  { name: 'Estoque', href: '/admin/estoque', icon: '📦' },
  { name: 'Financeiro', href: '/admin/financeiro', icon: '💰' },
  { name: 'Relatórios', href: '/admin/relatorios', icon: '📈' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 fixed left-0 top-0 bottom-0 shadow-lg`}
      >
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-2xl font-bold text-cyan-400">G•Lab</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-slate-700 rounded-lg transition"
            >
              {sidebarOpen ? '←' : '→'}
            </button>
          </div>
        </div>

        <nav className="mt-8 space-y-2 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          {sidebarOpen && (
            <div className="mb-4 pb-4 border-b border-slate-700">
              <p className="text-xs text-slate-400">Conectado como</p>
              <p className="text-sm font-medium text-white truncate">admin@glabcursos.com</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition text-sm font-medium"
          >
            {sidebarOpen ? 'Sair' : '⏚'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
          <div className="px-8 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {navigation.find((n) => pathname === n.href || pathname.startsWith(n.href + '/'))
                ?.name || 'Painel'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">
                  {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
