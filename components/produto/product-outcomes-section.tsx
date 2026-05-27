import { CheckCircle, TrendingUp } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"

export default function ProductOutcomesSection({ curso }: { curso: Curso }) {
  const aprendizados = curso.aprendizados

  if (!aprendizados || aprendizados.length === 0) return null

  return (
    <section className="py-16 relative" style={{ backgroundColor: "#050510" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,212,200,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
            <TrendingUp size={18} className="text-cyan-400" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Ao estudar este guia, você poderá:
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {aprendizados.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-white/8 px-4 py-4 transition-all duration-200 hover:border-cyan-500/25 group"
              style={{ background: "linear-gradient(135deg, rgba(0,212,200,0.025) 0%, transparent 100%)" }}
            >
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-cyan-500/20 transition-colors">
                <CheckCircle size={12} className="text-cyan-400" />
              </div>
              <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
