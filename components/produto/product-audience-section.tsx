import { AlertCircle } from "lucide-react"
import type { CursoSerializavel } from "@/lib/cursos-data"

export default function ProductAudienceSection({ curso }: { curso: CursoSerializavel }) {
  const dores = curso.dores
  const isCombo = curso.slug === "combo-iniciante-mobile"

  if (!dores || dores.length === 0) return null

  return (
    <section className="py-16 relative" style={{ backgroundColor: "#050510" }}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,200,0.2), transparent)" }}
      />

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/08 px-4 py-1.5 mb-5" style={{ background: "rgba(249,115,22,0.06)" }}>
              <AlertCircle size={13} className="text-orange-400" />
              <span className="text-[11px] font-bold tracking-wider text-orange-400 uppercase">
                Identificação
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4">
              {isCombo ? "Este combo é para você se:" : "Este guia é para você se:"}
            </h2>
            <p className="text-sm text-white/40 leading-relaxed">
              Se você se identificar com alguma dessas situações, este conteúdo foi desenvolvido para ajudar você a avançar com mais segurança.
            </p>
          </div>

          {/* Lista de dores */}
          <div className="flex flex-col gap-3">
            {dores.map((dor, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-white/8 px-5 py-4 transition-all duration-200 hover:border-orange-500/20"
                style={{ background: "rgba(249,115,22,0.03)" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-orange-500/25"
                  style={{ background: "rgba(249,115,22,0.08)" }}
                >
                  <span className="text-[10px] font-black text-orange-400">{i + 1}</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{dor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,200,0.2), transparent)" }}
      />
    </section>
  )
}
