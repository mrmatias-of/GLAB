'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, LogIn, LogOut, Menu, User, X } from 'lucide-react'
import { useState } from 'react'
import { signOut } from '@/lib/auth-client'

const NAV = [
  { label: 'Home',   href: '/' },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Contato', href: '/contato' },
]

export default function Header({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [open, setOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut({ fetchOptions: { onSuccess: () => window.location.href = '/' } })
    } catch (error) {
      console.error('[v0] Erro ao sair:', error)
      setIsSigningOut(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/[.08] bg-[#040610]/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-5 md:px-8 xl:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logo-glab-neon-transparent.png"
              alt="G-LAB Logo"
              width={80}
              height={80}
              className="h-14 w-14 object-contain drop-shadow-[0_0_18px_rgba(59,130,246,.45)]"
            />
            <span className="hidden sm:block">
              <strong className="block text-[13px] font-black tracking-[.18em] text-white">G·LAB CURSOS</strong>
              <span className="mt-1 block text-[8px] font-bold uppercase tracking-[.2em] text-cyan-200/45">Tecnologia · Precisão · Confiança</span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-1 rounded-full border border-white/[.08] bg-white/[.035] p-1.5 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-5 py-2 text-[9px] font-black uppercase tracking-[.18em] text-white/50 transition-colors hover:bg-white/[.06] hover:text-white"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Ações direita */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/aluno" className="hidden items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/[.08] px-5 py-3 text-[10px] font-black uppercase tracking-[.1em] text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-200/60 hover:bg-cyan-300/[.14] md:inline-flex">
                Meu perfil <User size={15} />
              </Link>
            ) : (
              <Link href="/sign-in" className="hidden items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/[.08] px-5 py-3 text-[10px] font-black uppercase tracking-[.1em] text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-200/60 hover:bg-cyan-300/[.14] md:inline-flex">
                Entrar <LogIn size={15} />
              </Link>
            )}
            <Link
              href="/cursos"
              className="hidden items-center gap-2 rounded-full bg-white px-5 py-3 text-[10px] font-black uppercase tracking-[.1em] text-[#061020] shadow-[0_12px_40px_rgba(255,255,255,.09)] transition hover:-translate-y-0.5 hover:bg-cyan-100 md:inline-flex"
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
              {isAuthenticated ? (
                <>
                  <Link href="/aluno" className="mb-3 flex w-full items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/[.08] px-4 py-3 text-xs font-black uppercase tracking-[.12em] text-cyan-100" onClick={() => setOpen(false)}>
                    Meu perfil <User size={15} />
                  </Link>
                  <button type="button" disabled={isSigningOut} onClick={handleSignOut} className="mb-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[.12em] text-white/60 hover:text-white disabled:opacity-50">
                    {isSigningOut ? 'Saindo...' : 'Sair'} <LogOut size={15} />
                  </button>
                </>
              ) : (
                <Link href="/sign-in" className="mb-3 flex w-full items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/[.08] px-4 py-3 text-xs font-black uppercase tracking-[.12em] text-cyan-100" onClick={() => setOpen(false)}>
                  Entrar na plataforma <LogIn size={15} />
                </Link>
              )}
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
