"use client"

import { useState } from "react"
import { Menu, X, Wrench } from "lucide-react"

export default function Header() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: "Início", href: "#inicio" },
    { label: "Professor", href: "#professor" },
    { label: "Cursos", href: "#cursos" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-background/80 backdrop-blur-md border-b border-border">
      {/* Menu toggle (mobile) */}
      <button
        className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
        <span className="text-sm font-medium">Menu</span>
      </button>

      {/* Logo / brand */}
      <a href="#inicio" className="flex items-center gap-2 text-cyan font-bold text-base tracking-tight">
        <span className="w-2 h-2 rounded-full bg-cyan inline-block" />
        <span>Guias Mestre</span>
        <span className="text-foreground/50 font-normal text-xs">· iPhone &amp; Android</span>
      </a>

      {/* Wrench icon */}
      <Wrench size={18} className="text-foreground/50" />

      {/* Mobile nav */}
      {open && (
        <nav className="absolute top-full left-0 right-0 bg-background border-b border-border flex flex-col py-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-6 py-3 text-sm text-foreground/80 hover:text-cyan hover:bg-surface transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
