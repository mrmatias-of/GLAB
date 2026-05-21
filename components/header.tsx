"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogIn, Search } from "lucide-react"
import SearchModal from "@/components/search-modal"

const links = [
  { label: "Início", href: "/" },
  { label: "Cursos", href: "/cursos" },
  { label: "Contato", href: "/contato" },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // Atalho Ctrl+K ou Cmd+K para abrir busca
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Fecha menu mobile ao navegar
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-[#070c12]/90 backdrop-blur-xl border-b border-[rgba(0,212,200,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-cyan/20 group-hover:bg-cyan/30 transition-colors" />
            <div className="absolute inset-0 rounded-lg border border-cyan/40" />
            <span className="relative text-cyan font-black text-sm tracking-tight">G</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-foreground font-bold text-sm tracking-wide">G•Lab</span>
            <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Cursos</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  active
                    ? "text-cyan bg-cyan/8 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        {/* Search + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-cyan/30 text-muted-foreground hover:text-foreground transition-all duration-200 group"
          >
            <Search size={16} />
            <span className="text-sm">Buscar</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 border border-border text-[10px] font-mono text-muted-foreground group-hover:border-cyan/20">
              <span className="text-[9px]">⌘</span>K
            </kbd>
          </button>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:border-cyan/30 transition-all duration-200"
          >
            <LogIn size={16} />
            Entrar
          </Link>
          <Link
            href="/cursos"
            className="relative inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-background bg-cyan hover:bg-cyan/90 transition-all duration-200 shadow-[0_0_20px_rgba(0,212,200,0.3)]"
          >
            Ver Cursos
          </Link>
        </div>

        {/* Mobile: botao de busca + toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-cyan/40 transition-all"
            aria-label="Buscar"
          >
            <Search size={18} />
          </button>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-cyan/40 transition-all"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#070c12]/98 backdrop-blur-xl border-b border-[rgba(0,212,200,0.1)] px-5 py-4 flex flex-col gap-1">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-3 text-sm rounded-lg transition-all ${
                  active ? "text-cyan bg-cyan/8 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            )
          })}
          <Link
            href="/cursos"
            className="mt-2 px-4 py-3 rounded-lg text-sm font-semibold text-background bg-cyan text-center"
          >
            Ver Cursos
          </Link>
          <Link
            href="/login"
            className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground border border-border text-center flex items-center justify-center gap-2"
          >
            <LogIn size={16} />
            Entrar
          </Link>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
