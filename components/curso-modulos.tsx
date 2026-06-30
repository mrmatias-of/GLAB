import { BookOpen, ChevronRight, Play } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"

export default function CursoModulos({ curso }: { curso: Curso }) {
  const totalTopicos = curso.modulos.reduce((acc, m) => acc + m.topicos.length, 0)

  return (
    <section className="py-20 relative" style={{ backgroundColor: '#050510' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(0,212,200,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,200,.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-blue-500/30 flex items-center justify-center">
              <BookOpen size={18} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-wide">
              Conteudo do Guia
            </h2>
          </div>
          <div className="sm:ml-auto flex items-center gap-4 text-sm text-white/40">
            <span><strong className="text-blue-400">{curso.modulos.length}</strong> modulos</span>
            <span><strong className="text-blue-400">{totalTopicos}</strong> topicos</span>
          </div>
        </div>

        {/* Modulos Grid */}
        <div className="flex flex-col gap-4">
          {curso.modulos.map((modulo, i) => (
            <div
              key={modulo.titulo}
              className="rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-blue-500/30"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(5,5,16,0.5) 100%)' }}
            >
              {/* Modulo header */}
              <div className="flex items-center gap-4 px-5 py-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-black text-blue-400">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-bold text-white text-base flex-1">{modulo.titulo}</h3>
                <span className="text-xs text-white/30 shrink-0 px-3 py-1 rounded-full border border-white/10 bg-white/5">
                  {modulo.topicos.length} topicos
                </span>
              </div>

              {/* Topicos */}
              <div className="flex flex-col">
                {modulo.topicos.map((topico, j) => (
                  <div 
                    key={topico} 
                    className="flex items-center gap-3 px-5 py-3 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Play size={10} className="text-blue-400/50" />
                    </div>
                    <span className="text-sm text-white/60">{topico}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
