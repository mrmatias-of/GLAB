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

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {cursos.map((cat) => {
            const Icon = cat.icon
            return (
              <div
                key={cat.slug}
                className={`group relative rounded-2xl border bg-gradient-to-b transition-all duration-500 card-premium flex flex-col ${
                  cat.destaque
                    ? "border-cyan/30 from-[#0d1e2e] to-surface shadow-[0_0_40px_rgba(0,212,200,0.1)] hover:shadow-[0_0_60px_rgba(0,212,200,0.18)]"
                    : "border-[rgba(0,212,200,0.1)] from-surface to-[#0b1320] hover:border-cyan/20 hover:shadow-[0_0_30px_rgba(0,212,200,0.08)]"
                }`}
              >
                {/* Destaque badge */}
                {cat.destaque && (
                  <div className="absolute -top-3 left-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan text-background text-[11px] font-black tracking-wide shadow-[0_0_14px_rgba(0,212,200,0.5)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-background animate-glow" />
                      MAIS POPULAR
                    </div>
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  {/* Icon + tag */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${cat.destaque ? "bg-cyan/15 border-cyan/30" : "bg-cyan/8 border-cyan/15"}`}>
                      <Icon size={20} className="text-cyan" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{cat.tag}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-foreground mb-3">{cat.titulo}</h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{cat.descricao}</p>

                  {/* Modules */}
                  <div className="flex flex-col gap-2 mb-8 flex-1">
                    {cat.modulos.slice(0, 4).map((m) => (
                      <div key={m.titulo} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-cyan/60" />
                        <span className="text-xs text-foreground/70">{m.titulo}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-5">
                    {cat.precoOriginal && (
                      <span className="text-xs text-muted-foreground line-through">{cat.precoOriginal}</span>
                    )}
                    <span className="text-2xl font-black text-cyan">{cat.preco}</span>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/cursos/${cat.slug}`}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl font-bold text-sm px-5 py-3.5 transition-all duration-300 group/btn ${
                      cat.destaque
                        ? "bg-cyan text-background hover:bg-cyan/90 shadow-[0_0_24px_rgba(0,212,200,0.3)] hover:shadow-[0_0_36px_rgba(0,212,200,0.45)]"
                        : "border border-cyan/25 text-cyan hover:bg-cyan/10 hover:border-cyan/40"
                    }`}
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
