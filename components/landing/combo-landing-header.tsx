"use client"

import Link from "next/link"
import Image from "next/image"

export default function ComboLandingHeader() {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: "rgba(5,7,12,0.92)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          aria-label="G•Lab Cursos — Página inicial"
        >
          <Image
            src="/logo-glab-neon-transparent.png"
            alt="G•Lab Cursos"
            width={72}
            height={72}
            className="w-14 h-14 sm:w-18 sm:h-18"
          />
          <span
            className="text-sm font-bold tracking-tight hidden sm:block"
            style={{ color: "#ffffff" }}
          >
            G•Lab Cursos
          </span>
        </Link>

        {/* Ação direita — link discreto para alunos */}
        <a
          href="https://app.kirvano.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium transition-colors"
          style={{ color: "#71717a" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4c8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#71717a")}
        >
          Acessar conteúdo
        </a>
      </div>
    </header>
  )
}
