'use client'

import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { useState } from 'react'
import SearchModal from './search-modal'

const NAV = [
  { label: 'Home',   href: '/' },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Contato', href: '/contato' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{ backgroundColor: '#0B0B0C', borderBottom: '1px solid #27272a' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-white font-extrabold tracking-widest uppercase text-sm"
          >
            G•LAB
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-xs font-semibold tracking-widest uppercase transition-colors"
                style={{ color: '#71717a' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Ações direita */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
              style={{ color: '#71717a' }}
              className="hover:text-white transition-colors"
            >
              <Search size={18} />
            </button>
            <Link
              href="/cursos"
              className="hidden md:inline-flex btn-primary text-xs py-2 px-5"
            >
              Ver Cursos
            </Link>
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              className="md:hidden transition-colors"
              style={{ color: '#71717a' }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {open && (
          <nav
            className="md:hidden px-6 py-4 space-y-1"
            style={{ borderTop: '1px solid #27272a', backgroundColor: '#0B0B0C' }}
          >
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-semibold tracking-wider uppercase transition-colors"
                style={{ color: '#71717a' }}
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-3">
              <Link href="/cursos" className="btn-primary w-full justify-center text-xs py-2.5">
                Ver Cursos
              </Link>
            </div>
          </nav>
        )}
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

