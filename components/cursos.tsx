import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { cursos } from "@/lib/cursos-data"

export default function Cursos() {
  return (
    <section id="cursos" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan/4 blur-[130px] pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,212,200,0.4) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5">
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/8 px-4 py-1.5 mb-5">
            <BookOpen size={12} className="text-cyan" />
            <span className="text-xs font-semibold tracking-[0.18em] text-cyan uppercase">Cursos Disponíveis</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-balance leading-tight mb-3">
            Escolha sua{" "}
            <span className="text-cyan glow-text">especialidade</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md">
            Guias completos, passo a passo, criados para o profissional que quer resultados concretos.
          </p>
        </div>

        {/* Card Destaque (Combo) */}
        {cursos.filter(c => c.destaque).map((cat) => {
          const Icon = cat.icon
          return (
            <div key={cat.slug} className="relative rounded-2xl border border-cyan/30 bg-gradient-to-br from-[#0d1e2e] to-surface shadow-[0_0_60px_rgba(0,212,200,0.12)] card-premium mb-6">
              <span className="shimmer-inner" />
              <div className="relative z-10 p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
                {/* Badge flutuante dentro do card */}
                <div className="absolute top-4 right-5 md:top-6 md:right-7 z-20">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan text-background text-[11px] font-black tracking-widest uppercase shadow-[0_0_18px_rgba(0,212,200,0.6)]"
                    style={{ animation: "float 3s ease-in-out infinite" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-background animate-glow" />
                    Mais Popular
                  </div>
                </div>
                {/* Left */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-cyan/15 border-cyan/30">
                      <Icon size={22} className="text-cyan" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-bold tracking-widest text-cyan uppercase">{cat.tag}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3">{cat.titulo}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{cat.descricao}</p>
                  <div className="flex items-baseline gap-2">
                    {cat.precoOriginal && (
                      <span className="text-sm text-muted-foreground line-through">{cat.precoOriginal}</span>
                    )}
                    <span className="text-3xl font-black text-cyan">{cat.preco}</span>
                  </div>
                </div>
                {/* Right */}
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    {cat.modulos.map((m) => (
                      <div key={m.titulo} className="flex items-center gap-2 rounded-lg bg-cyan/5 border border-cyan/10 px-3 py-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan flex-shrink-0" />
                        <span className="text-xs text-foreground/80 leading-tight">{m.titulo}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={cat.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-bold text-sm px-5 py-4 bg-cyan text-background hover:bg-cyan/90 shadow-[0_0_28px_rgba(0,212,200,0.35)] hover:shadow-[0_0_44px_rgba(0,212,200,0.5)] transition-all duration-300 group/btn"
                  >
                    Ver Guia Completo
                    <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          )
        })}

        {/* Cards secundários */}
        <div className="grid md:grid-cols-3 gap-6">
          {cursos.filter(c => !c.destaque).map((cat) => {
            const Icon = cat.icon
            return (
              <div
                key={cat.slug}
                className="group relative rounded-2xl border border-[rgba(0,212,200,0.1)] bg-gradient-to-b from-surface to-[#0b1320] hover:border-cyan/25 hover:shadow-[0_0_30px_rgba(0,212,200,0.08)] transition-all duration-500 card-premium flex flex-col"
              >
                <span className="shimmer-inner" />
                <div className="p-7 flex flex-col flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-cyan/8 border-cyan/15">
                      <Icon size={18} className="text-cyan" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{cat.tag}</span>
                  </div>
                  <h3 className="text-lg font-black text-foreground mb-2">{cat.titulo}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{cat.descricao}</p>
                  <div className="flex flex-col gap-1.5 mb-6">
                    {cat.modulos.slice(0, 4).map((m) => (
                      <div key={m.titulo} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-cyan/50" />
                        <span className="text-xs text-foreground/60">{m.titulo}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    {cat.precoOriginal && (
                      <span className="text-xs text-muted-foreground line-through">{cat.precoOriginal}</span>
                    )}
                    <span className="text-2xl font-black text-cyan">{cat.preco}</span>
                  </div>
                  <Link
                    href={`/cursos/${cat.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-bold text-sm px-5 py-3 border border-cyan/25 text-cyan hover:bg-cyan/10 hover:border-cyan/40 transition-all duration-300 group/btn"
                  >
                    Ver Guia Completo
                    <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
