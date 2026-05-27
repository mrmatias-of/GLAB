"use client"

import { useState } from "react"
import { BookOpen, ChevronDown, Play } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"

export default function ProductCurriculumSection({ curso }: { curso: Curso }) {
  const [abertos, setAbertos] = useState<number[]>([0])
  const totalTopicos = curso.modulos.reduce((acc, m) => acc + m.topicos.length, 0)

  if (!curso.modulos || curso.modulos.length === 0) return null

  function toggle(i: number) {
    setAbertos((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    )
  }

  return (
    <section className="py-16 relative" style={{ backgroundColor: "#050510" }}>
      <div
        className="absolute inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,200,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,200,.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
              <BookOpen size={18} className="text-cyan-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">Conteúdo do guia</h2>
          </div>
          <div className="sm:ml-auto flex items-center gap-4 text-sm text-white/40">
            <span>
              <strong className="text-cyan-400">{curso.modulos.length}</strong> módulos
            </span>
            <span>
              <strong className="text-cyan-400">{totalTopicos}</strong> tópicos
            </span>
          </div>
        </div>

        {/* Acordeão */}
        <div className="flex flex-col gap-3">
          {curso.modulos.map((modulo, i) => {
            const isOpen = abertos.includes(i)
            return (
              <div
                key={modulo.titulo}
                className="rounded-2xl border overflow-hidden transition-all duration-300"
                style={{
                  borderColor: isOpen ? "rgba(0,212,200,0.25)" : "rgba(255,255,255,0.07)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(5,5,16,0.6) 100%)",
                }}
              >
                {/* Cabeçalho do módulo */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-cyan-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm flex-1 text-left">{modulo.titulo}</h3>
                  <span className="text-[11px] text-white/30 shrink-0 px-3 py-1 rounded-full border border-white/8 bg-white/3 hidden sm:inline">
                    {modulo.topicos.length} tópicos
                  </span>
                  <ChevronDown
                    size={16}
                    className="text-white/30 shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                {/* Tópicos */}
                {isOpen && (
                  <div className="flex flex-col border-t border-white/5">
                    {modulo.topicos.map((topico, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-3 px-5 py-3 border-b border-white/5 last:border-b-0 hover:bg-white/[0.015] transition-colors"
                      >
                        <div className="w-6 h-6 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center shrink-0">
                          <Play size={9} className="text-cyan-400/50 ml-0.5" />
                        </div>
                        <span className="text-sm text-white/60">{topico}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
