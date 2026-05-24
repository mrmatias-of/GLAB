import { CheckCircle, Lightbulb, Sparkles } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"

export default function CursoAprendizados({ curso }: { curso: Curso }) {
  return (
    <section className="py-16 relative" style={{ backgroundColor: '#050510' }}>
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-20" style={{
          background: 'radial-gradient(circle, rgba(0,212,200,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }} />
      </div>

      {/* Top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,200,0.3), transparent)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Lightbulb size={18} className="text-cyan-400" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wide">
            O que voce vai aprender
          </h2>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {curso.aprendizados.map((item, i) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-white/10 px-4 py-4 transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.02] group"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)' }}
            >
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-cyan-500/20 transition-colors">
                <CheckCircle size={12} className="text-cyan-400" />
              </div>
              <span className="text-sm text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,200,0.3), transparent)' }} />
    </section>
  )
}
