'use client'

import React, { useState } from 'react'
import { Search, Bell, Settings, User, LogOut, ChevronDown } from 'lucide-react'

interface PremiumHeaderProps {
  title?: string
  breadcrumb?: { label: string; href?: string }[]
}

export function PremiumHeader({ title, breadcrumb }: PremiumHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white backdrop-blur-xl" style={{ backgroundColor: '#ffffff' }}>
      {/* Mobile Header - Compact */}
      <div className="lg:hidden px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          {title && (
            <h1 className="text-lg font-bold text-slate-900 truncate">{title}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 hover:opacity-90 transition-opacity"
            >
              <User className="w-5 h-5 text-white" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white border border-slate-200 shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-900">Admin</p>
                  <p className="text-xs text-slate-500">admin@glabcursos.com</p>
                </div>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-200">
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header - Full Featured */}
      <div className="hidden lg:flex px-6 py-4 items-center justify-between gap-6">
        {/* Left - Title & Breadcrumb */}
        <div className="flex-1 min-w-0">
          {title && (
            <h1 className="text-2xl font-bold text-slate-900 truncate">{title}</h1>
          )}
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="flex items-center gap-2 text-sm mt-2">
              {breadcrumb.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-slate-400">/</span>}
                  <a 
                    href={item.href || '#'} 
                    className="text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {item.label}
                  </a>
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>

        {/* Right - Search, Notifications, Settings, User Menu */}
        <div className="flex items-center gap-4">
          {/* Search Bar - Desktop only */}
          <div className="relative w-64">
            <div className="absolute inset-0 rounded-lg bg-slate-100 border border-slate-200" />
            <div className="relative flex items-center px-3 py-2 gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-500 flex-1"
              />
            </div>
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
            <Bell className="w-5 h-5 text-slate-600 hover:text-slate-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Settings className="w-5 h-5 text-slate-600 hover:text-slate-700" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-slate-600" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white border border-slate-200 shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-900">Admin</p>
                  <p className="text-xs text-slate-500">admin@glabcursos.com</p>
                </div>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-200">
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
