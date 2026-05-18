import Link from "next/link"
import { ArrowLeft, Tag } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"

export default function CursoHero({ curso }: { curso: Curso }) {
  const Icon = curso.icon
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-24 pb-16">
      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-cyan/6 blur-[120px] pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,212,200,0.5) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-5 w-full">
        {/* Back link */}
        <Link
          href="/#cursos"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-cyan transition-colors text-sm mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para os cursos
        </Link>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Left — content */}
          <div className="flex-1">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/8 px-4 py-1.5 mb-6">
              <Icon size={12} className="text-cyan" />
              <span className="text-xs font-semibold tracking-[0.18em] text-cyan uppercase">{curso.tag}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-balance leading-tight mb-5">
              {curso.titulo}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
              {curso.subtitulo}
            </p>

            {/* Modules count pill */}
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2">
                <span className="text-sm font-bold text-cyan">{curso.modulos.length}</span>
                <span className="text-sm text-muted-foreground">módulos</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2">
                <span className="text-sm font-bold text-cyan">
                  {curso.modulos.reduce((acc, m) => acc + m.aulas.length, 0)}
                </span>
                <span className="text-sm text-muted-foreground">aulas</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2">
                <Tag size={13} className="text-cyan" />
                <span className="text-sm text-muted-foreground">Acesso vitalício</span>
              </div>
            </div>
          </div>

          {/* Right — price card */}
          <div className="w-full md:w-72 shrink-0">
            <div className="rounded-2xl border border-cyan/20 bg-gradient-to-b from-[#0d1e2e] to-surface p-7 shadow-[0_0_40px_rgba(0,212,200,0.08)]">
              {curso.precoOriginal && (
                <p className="text-sm text-muted-foreground line-through mb-1">{curso.precoOriginal}</p>
              )}
              <p className="text-5xl font-black text-cyan glow-text mb-1">{curso.preco}</p>
              <p className="text-xs text-muted-foreground mb-6">pagamento único</p>
              <a
                href={curso.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan text-background font-black text-sm px-5 py-3.5 shadow-[0_0_24px_rgba(0,212,200,0.3)] hover:shadow-[0_0_40px_rgba(0,212,200,0.5)] hover:bg-cyan/90 transition-all duration-300"
              >
                {curso.cta}
              </a>
              <p className="text-[11px] text-muted-foreground text-center mt-4">
                Checkout seguro via Kirvano / Kiwify
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
