'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Search } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { label: 'Home',   href: '/' },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Contato', href: '/contato' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logo-glab-neon-transparent.png"
              alt="G-LAB Logo"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-xs font-semibold tracking-widest uppercase transition-colors"
                style={{ color: '#6b7280' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Ações direita */}
          <div className="flex items-center gap-3">
            <Link
              href="/cursos"
              className="hidden md:inline-flex btn-primary text-xs py-2 px-5"
            >
              Ver Cursos
            </Link>
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              className="md:hidden transition-colors cursor-pointer"
              style={{ color: '#6b7280' }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {open && (
          <nav
            className="md:hidden px-6 py-4 space-y-1"
            style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}
          >
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-semibold tracking-wider uppercase transition-colors"
                style={{ color: '#6b7280' }}
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <Link href="/cursos" className="btn-primary w-full justify-center text-xs py-2.5" onClick={() => setOpen(false)}>
                Ver Cursos
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  )
}

