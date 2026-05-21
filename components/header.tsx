"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search, User } from "lucide-react"
import SearchModal from "@/components/search-modal"

const links = [
  { label: "Inicio", href: "/" },
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

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-black/90 backdrop-blur-xl border-b border-white/5"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <span className="text-white font-black text-sm">G</span>
          </div>
          <span className="text-white font-bold text-lg">G-Lab</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <Search size={18} />
          </button>
          <Link
            href="/login"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <User size={18} />
          </Link>
          <Link
            href="/cursos"
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          >
            Ver Cursos
          </Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60"
          >
            <Search size={18} />
          </button>
          <button
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/98 backdrop-blur-xl border-b border-white/5 px-6 py-6 flex flex-col gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-3 text-sm font-medium text-white/80 hover:text-white rounded-xl hover:bg-white/5 transition-all"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/cursos"
            className="mt-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 text-center"
          >
            Ver Cursos
          </Link>
        </div>
      )}

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
