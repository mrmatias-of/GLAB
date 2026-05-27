import { ArrowRight, ShieldCheck, Clock, Award, Zap } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"

export default function ProductFinalCTA({ curso }: { curso: Curso }) {
  const headline =
    curso.ctaHeadline ||
    `Pronto para evoluir com ${curso.titulo}?`
  const sub =
    curso.ctaHeadlineSub ||
    curso.descricaoLonga ||
    curso.descricao

  const ctaLabel = `Quero acessar por ${curso.preco}`

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "#050510" }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,200,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,200,.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0,212,200,0.08) 0%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div
          className="rounded-3xl border-2 border-cyan-500/25 p-10 md:p-14 relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(0,212,200,0.07) 0%, rgba(5,5,16,0.98) 100%)",
          }}
        >
          {/* Glow */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(0,212,200,0.2) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-20 h-px" style={{ background: "linear-gradient(90deg, rgba(0,212,200,0.5), transparent)" }} />
          <div className="absolute top-0 left-0 w-px h-20" style={{ background: "linear-gradient(180deg, rgba(0,212,200,0.5), transparent)" }} />
          <div className="absolute top-0 right-0 w-20 h-px" style={{ background: "linear-gradient(270deg, rgba(139,92,246,0.5), transparent)" }} />
          <div className="absolute top-0 right-0 w-px h-20" style={{ background: "linear-gradient(180deg, rgba(139,92,246,0.5), transparent)" }} />

          <div className="relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/08 px-4 py-1.5 mb-6" style={{ background: "rgba(0,212,200,0.06)" }}>
              <Zap size={13} className="text-cyan-400" />
              <span className="text-[11px] font-bold tracking-wider text-cyan-400 uppercase">
                Acesso imediato
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4">
              {headline}
            </h2>

            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
              {sub}
            </p>

            {/* Preço */}
            <div className="flex items-baseline justify-center gap-3 mb-8">
              {curso.precoOriginal && (
                <span className="text-white/30 line-through text-xl">{curso.precoOriginal}</span>
              )}
              <span
                className="text-5xl md:text-6xl font-black text-cyan-400"
                style={{ textShadow: "0 0 40px rgba(0,212,200,0.5)" }}
              >
                {curso.preco}
              </span>
            </div>

            {/* Botão */}
            <a
              href={curso.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-black text-lg px-10 py-5 transition-all duration-300 group w-full sm:w-auto hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #00d4c8 0%, #06b6d4 100%)",
                color: "#050510",
                boxShadow: "0 0 40px rgba(0,212,200,0.4)",
              }}
            >
              {ctaLabel}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-5 mt-8">
              {[
                { icon: ShieldCheck, label: "Pagamento seguro" },
                { icon: Clock, label: "Acesso vitalício" },
                { icon: Award, label: "Certificado incluso" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-xs text-white/35">
                  <b.icon size={14} className="text-cyan-400/50" />
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
