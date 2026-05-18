"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const links = [
  { label: "Início", href: "/" },
  { label: "Cursos", href: "/cursos" },
  { label: "Contato", href: "/contato" },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
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

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/cursos"
            className="relative inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-background bg-cyan hover:bg-cyan/90 transition-all duration-200 shadow-[0_0_20px_rgba(0,212,200,0.3)]"
          >
            Ver Cursos
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-cyan/40 transition-all"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
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
        </div>
      )}
    </header>
  )
}
