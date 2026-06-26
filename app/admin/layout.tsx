'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Wrench,
  Package,
  Wallet,
  TrendingUp,
  Menu,
  X,
  LogOut,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Ordens de Serviço', href: '/admin/ordens-servico', icon: ClipboardList },
  { name: 'Clientes', href: '/admin/clientes', icon: Users },
  { name: 'Técnicos', href: '/admin/tecnicos', icon: Wrench },
  { name: 'Estoque', href: '/admin/estoque', icon: Package },
  { name: 'Financeiro', href: '/admin/financeiro', icon: Wallet },
  { name: 'Relatórios', href: '/admin/relatorios', icon: TrendingUp },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    router.push('/login')
  }

  const currentTitle =
    navigation.find((n) => pathname === n.href || pathname.startsWith(n.href + '/'))?.name ||
    'Painel'

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cyan-400">G•Lab</h1>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition"
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-6 space-y-1 px-3 flex-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="mb-3 pb-3 border-b border-slate-700">
          <p className="text-xs text-slate-400">Conectado como</p>
          <p className="text-sm font-medium text-white truncate">admin@glabcursos.com</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition text-sm font-medium"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar - fixed */}
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white fixed left-0 top-0 bottom-0 shadow-lg z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - overlay drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="lg:hidden flex flex-col w-72 max-w-[80%] bg-gradient-to-b from-slate-900 to-slate-800 text-white fixed left-0 top-0 bottom-0 shadow-2xl z-50">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4 flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg transition"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6 text-slate-700" />
            </button>
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 flex-1 truncate">
              {currentTitle}
            </h2>
            <p className="text-sm text-slate-600 hidden sm:block">
              {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
