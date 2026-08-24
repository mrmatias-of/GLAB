'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Menu, X } from 'lucide-react'
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
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logo-glab-neon-transparent.png"
              alt="G-LAB Logo"
              width={80}
              height={80}
              className="w-16 h-16 object-contain drop-shadow-[0_0_18px_rgba(59,130,246,.45)]"
            />
            <span className="hidden sm:block">
              <strong className="block text-sm font-black tracking-[.16em] text-white">G·LAB CURSOS</strong>
              <span className="mt-1 block text-[8px] font-bold uppercase tracking-[.18em] text-white/35">Formação técnica profissional</span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-[11px] font-bold tracking-[.18em] uppercase text-white/55 transition-colors hover:text-white"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Ações direita */}
          <div className="flex items-center gap-3">
            <Link
              href="/cursos"
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_30px_rgba(37,99,235,.3)] transition hover:-translate-y-0.5 hover:bg-blue-400"
            >
              Ver catálogo completo <ArrowUpRight size={15} />
            </Link>
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              className="md:hidden text-white transition-colors cursor-pointer"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {open && (
          <nav
            className="md:hidden px-6 py-5 space-y-1 border-t border-white/10 bg-[#080b18]"
          >
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm font-semibold tracking-wider uppercase text-white/70 transition-colors hover:text-white"
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10">
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

