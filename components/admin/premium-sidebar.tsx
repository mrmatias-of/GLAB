'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Zap,
  BarChart3,
  FileText,
  Settings,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'
import Image from 'next/image'

const menuItems = [
  { label: 'Dashboard', href: '/admin/dashboard-intelligence', icon: LayoutDashboard },
  { label: 'Ordens de Serviço', href: '/admin/ordens', icon: ClipboardList },
  { label: 'Clientes', href: '/admin/clientes', icon: Users },
  { label: 'Técnicos', href: '/admin/tecnicos', icon: Zap },
  { label: 'Financeiro', href: '/admin/financeiro-avancado', icon: BarChart3 },
  { label: 'Relatórios', href: '/admin/relatorios', icon: FileText },
]

const systemItems = [
  { label: 'Configurações', href: '/admin/configuracoes', icon: Settings },
]

export function PremiumSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 w-64 h-screen flex flex-col bg-white border-r border-slate-200 overflow-y-auto transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Logo Section */}
        <div className="p-4 lg:p-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-9 h-9 lg:w-10 lg:h-10 rounded-lg overflow-hidden border border-blue-500/30 shadow-lg flex-shrink-0">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-glab-neon-transparent-2kFvS2C6hGbJR8B91q0a0cgSa9Uqxz.png"
                alt="G-Lab Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-slate-900 text-base lg:text-lg truncate">G•LAB</h1>
              <p className="text-xs text-slate-400 truncate">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-4">
            Principal
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden group ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium flex-1">{item.label}</span>

                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600" />
                  )}

                  {!active && (
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors" />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* System Section */}
        <div className="border-t border-slate-200 px-4 py-4 space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-4">
            Sistema
          </p>

          {systemItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* User Info */}
        <div className="border-t border-slate-200 p-4 space-y-3">
          <div className="flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Admin</p>
              <p className="text-xs text-slate-500 truncate">admin@glab.com</p>
            </div>
          </div>

          <button className="w-full px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors">
            Sair
          </button>
        </div>
      </aside>

      {/* Content Offset for Desktop */}
      <div className="hidden lg:block w-64" />
    </>
  )
}
