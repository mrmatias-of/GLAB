import { ArrowRight, Clock, Award, Zap, ShieldCheck } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"

export default function ProductOfferCard({ curso }: { curso: Curso }) {
  const ctaLabel = `Quero acessar este guia por ${curso.preco}`

  return (
    <section className="py-12 relative" style={{ backgroundColor: "#050510" }}>
      <div className="max-w-3xl mx-auto px-6">
        <div
          className="rounded-3xl border-2 border-cyan-500/25 p-8 md:p-10 relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(0,212,200,0.07) 0%, rgba(5,5,16,0.98) 100%)",
          }}
        >
          {/* Glow */}
          <div
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(0,212,200,0.18) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-20 h-px" style={{ background: "linear-gradient(90deg, rgba(0,212,200,0.5), transparent)" }} />
          <div className="absolute top-0 left-0 w-px h-20" style={{ background: "linear-gradient(180deg, rgba(0,212,200,0.5), transparent)" }} />
          <div className="absolute top-0 right-0 w-20 h-px" style={{ background: "linear-gradient(270deg, rgba(139,92,246,0.5), transparent)" }} />
          <div className="absolute top-0 right-0 w-px h-20" style={{ background: "linear-gradient(180deg, rgba(139,92,246,0.5), transparent)" }} />

          <div className="relative text-center">
            <p className="text-sm font-bold text-white/60 mb-1">{curso.titulo}</p>

            {/* Preço */}
            <div className="flex items-baseline justify-center gap-3 mb-1">
              {curso.precoOriginal && (
                <span className="text-xl text-white/30 line-through">{curso.precoOriginal}</span>
              )}
              <span
                className="text-5xl font-black text-cyan-400"
                style={{ textShadow: "0 0 35px rgba(0,212,200,0.4)" }}
              >
                {curso.preco}
              </span>
            </div>
            <p className="text-xs text-white/40 mb-7">pagamento único · acesso vitalício</p>

            {/* Benefícios resumidos */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-7">
              {[
                { icon: Zap, label: "Acesso imediato" },
                { icon: Award, label: "Certificado digital" },
                { icon: Clock, label: "Acesso vitalício" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 text-xs text-white/45">
                  <b.icon size={13} className="text-cyan-400/70" />
                  {b.label}
                </div>
              ))}
            </div>

            {/* Botão */}
            <a
              href={curso.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-black text-base px-10 py-4 transition-all duration-300 hover:brightness-110 group w-full sm:w-auto"
              style={{
                background: "linear-gradient(135deg, #00d4c8 0%, #06b6d4 100%)",
                color: "#050510",
                boxShadow: "0 0 35px rgba(0,212,200,0.4)",
              }}
            >
              {ctaLabel}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </a>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-white/30">
              <ShieldCheck size={12} className="text-cyan-400/40" />
              Pagamento seguro via Kirvano
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
