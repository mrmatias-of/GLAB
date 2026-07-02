'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function HomeHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              G•Lab
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Recursos
            </Link>
            <Link
              href="#courses"
              className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Cursos
            </Link>
            <Link
              href="#contato"
              className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Contato
            </Link>
            <Link
              href="/login"
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              Entrar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-slate-300" />
            ) : (
              <Menu size={24} className="text-slate-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-800/50 mt-4">
            <Link
              href="#features"
              className="block py-2 text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Recursos
            </Link>
            <Link
              href="#courses"
              className="block py-2 text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Cursos
            </Link>
            <Link
              href="#contato"
              className="block py-2 text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Contato
            </Link>
            <Link
              href="/login"
              className="block mt-4 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors text-center"
            >
              Entrar
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
