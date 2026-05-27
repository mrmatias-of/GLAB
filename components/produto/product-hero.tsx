import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, Zap, Clock, Award, Layers } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"
import BackButton from "@/components/back-button"

const nivelColorMap: Record<string, { bg: string; text: string; border: string }> = {
  iniciante: { bg: "rgba(16,185,129,0.1)", text: "#10b981", border: "rgba(16,185,129,0.3)" },
  "iniciante a intermediário": { bg: "rgba(0,212,200,0.1)", text: "#00d4c8", border: "rgba(0,212,200,0.3)" },
  intermediário: { bg: "rgba(124,58,237,0.1)", text: "#7c3aed", border: "rgba(124,58,237,0.3)" },
  avançado: { bg: "rgba(249,115,22,0.1)", text: "#f97316", border: "rgba(249,115,22,0.3)" },
  "todos os níveis": { bg: "rgba(255,255,255,0.07)", text: "rgba(255,255,255,0.7)", border: "rgba(255,255,255,0.15)" },
}

function getNivelColors(nivel?: string) {
  if (!nivel) return nivelColorMap["iniciante"]
  const key = nivel.toLowerCase()
  return nivelColorMap[key] ?? nivelColorMap["iniciante"]
}

export default function ProductHero({ curso }: { curso: Curso }) {
  const totalTopicos = curso.modulos.reduce((acc, m) => acc + m.topicos.length, 0)
  const nivelColors = getNivelColors(curso.nivel)
  const headline = curso.headline || curso.titulo
  const subtitulo = curso.headlineSub || curso.subtitulo || curso.descricao
  const nivelLabel = curso.nivel
    ? curso.nivel.charAt(0).toUpperCase() + curso.nivel.slice(1)
    : "Iniciante"

  return (
    <section
      className="relative min-h-[85vh] flex items-center pt-24 pb-16"
      style={{ backgroundColor: "#050510" }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,200,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,200,.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute top-16 right-1/4 w-[600px] h-[400px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(0,212,200,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[400px] h-[300px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-0 left-0 w-px h-full"
          style={{
            background: "linear-gradient(to bottom, rgba(0,212,200,0.2), transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <BackButton />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mt-4">
          {/* Coluna esquerda */}
          <div>
            {/* Badges superiores */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {curso.categoria && (
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border"
                  style={{ background: "rgba(0,212,200,0.06)", color: "#00d4c8", borderColor: "rgba(0,212,200,0.25)" }}
                >
                  {curso.categoria}
                </span>
              )}
              <span
                className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border"
                style={{ background: nivelColors.bg, color: nivelColors.text, borderColor: nivelColors.border }}
              >
                {nivelLabel}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              {headline}
            </h1>

            <p className="text-base md:text-lg text-white/60 leading-relaxed mb-8 max-w-xl">
              {subtitulo}
            </p>

            {/* Stats rápidas */}
            <div className="flex flex-wrap gap-3 mb-8">
              {curso.modulos.length > 0 && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                  <BookOpen size={15} className="text-cyan-400" />
                  <span className="text-sm font-bold text-white">{curso.modulos.length}</span>
                  <span className="text-sm text-white/50">módulos</span>
                </div>
              )}
              {totalTopicos > 0 && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                  <Zap size={15} className="text-cyan-400" />
                  <span className="text-sm font-bold text-white">{totalTopicos}</span>
                  <span className="text-sm text-white/50">tópicos</span>
                </div>
              )}
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                <Clock size={15} className="text-cyan-400" />
                <span className="text-sm text-white/60">Acesso vitalício</span>
              </div>
            </div>

            {/* Price + CTA (mobile) */}
            <div className="lg:hidden">
              <PriceCard curso={curso} />
            </div>
          </div>

          {/* Coluna direita */}
          <div className="flex flex-col gap-5">
            {curso.imagem ? (
              <div
                className="relative rounded-2xl border border-cyan-500/20 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(0,212,200,0.04) 0%, rgba(139,92,246,0.04) 100%)",
                }}
              >
                <Image
                  src={curso.imagem}
                  alt={curso.titulo}
                  width={800}
                  height={450}
                  className="w-full h-auto object-contain"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/40 via-transparent to-transparent pointer-events-none" />
              </div>
            ) : (
              <div
                className="relative rounded-2xl border border-cyan-500/20 flex items-center justify-center py-16"
                style={{ background: "linear-gradient(135deg, rgba(0,212,200,0.04) 0%, rgba(139,92,246,0.04) 100%)" }}
              >
                <Layers size={64} className="text-cyan-500/30" />
              </div>
            )}
            {/* Price card desktop */}
            <div className="hidden lg:block">
              <PriceCard curso={curso} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PriceCard({ curso }: { curso: Curso }) {
  const ctaLabel = curso.cta && curso.cta !== "COMPRAR AGORA" && curso.cta !== "Comprar Agora"
    ? curso.cta
    : `Quero acessar este guia por ${curso.preco}`

  return (
    <div
      className="rounded-2xl border-2 border-cyan-500/25 p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(0,212,200,0.07) 0%, rgba(5,5,16,0.97) 100%)",
      }}
    >
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,212,200,0.18) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
      <div className="relative">
        {/* Preço */}
        <div className="flex items-baseline gap-3 mb-1">
          {curso.precoOriginal && (
            <span className="text-lg text-white/30 line-through">{curso.precoOriginal}</span>
          )}
          <span
            className="text-4xl md:text-5xl font-black text-cyan-400"
            style={{ textShadow: "0 0 30px rgba(0,212,200,0.4)" }}
          >
            {curso.preco}
          </span>
        </div>
        <p className="text-xs text-white/40 mb-5">pagamento único</p>

        {/* Botão */}
        <a
          href={curso.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-black text-base px-6 py-4 transition-all duration-300 hover:brightness-110 group"
          style={{
            background: "linear-gradient(135deg, #00d4c8 0%, #06b6d4 100%)",
            color: "#050510",
            boxShadow: "0 0 28px rgba(0,212,200,0.35)",
          }}
        >
          {ctaLabel}
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </a>

        {/* Microinformações */}
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 justify-center">
          {[
            { icon: Clock, label: "Acesso imediato" },
            { icon: Award, label: "Certificado digital" },
            { icon: Zap, label: "Pagamento único" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <item.icon size={12} className="text-cyan-400/60" />
              <span className="text-[11px] text-white/40">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
