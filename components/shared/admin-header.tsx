'use client'

import React from 'react'
import { Search, Bell, Settings } from 'lucide-react'

interface AdminHeaderProps {
  title?: string
  breadcrumb?: { label: string; href?: string }[]
}

export function AdminHeader({ title, breadcrumb }: AdminHeaderProps) {
  return (
    <div className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-sm sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Left side - Title */}
        <div className="flex-1">
          {title && (
            <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
          )}
        </div>

        {/* Right side - Search, Notifications, Settings */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder-slate-500 w-48"
            />
          </div>

          <button className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <Bell className="w-5 h-5 text-slate-400" />
          </button>

          <button className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
