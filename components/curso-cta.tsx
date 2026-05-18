import { ArrowRight, ShieldCheck, Zap } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"

export default function CursoCTA({ curso }: { curso: Curso }) {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[200px] rounded-full bg-cyan/8 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-5 text-center">
        <div className="rounded-3xl border border-cyan/20 bg-gradient-to-b from-[#0d1e2e] to-surface p-10 md:p-14 shadow-[0_0_60px_rgba(0,212,200,0.07)]">

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/8 px-4 py-1.5 mb-6">
            <Zap size={12} className="text-cyan" />
            <span className="text-xs font-semibold tracking-[0.18em] text-cyan uppercase">Acesso Imediato</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-balance leading-tight mb-3">
            Pronto para dominar{" "}
            <span className="text-cyan glow-text">{curso.tag}?</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            {curso.descricaoLonga}
          </p>

          {/* Price */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {curso.precoOriginal && (
              <span className="text-muted-foreground line-through text-lg">{curso.precoOriginal}</span>
            )}
            <span className="text-5xl font-black text-cyan glow-text">{curso.preco}</span>
          </div>

          <a
            href={curso.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan text-background font-black text-base px-8 py-4 shadow-[0_0_30px_rgba(0,212,200,0.35)] hover:shadow-[0_0_50px_rgba(0,212,200,0.55)] hover:bg-cyan/90 transition-all duration-300 w-full sm:w-auto group"
          >
            {curso.cta}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Garantia */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
            <ShieldCheck size={13} className="text-cyan/70" />
            Pagamento único &middot; Acesso vitalício
          </div>
        </div>
      </div>
    </section>
  )
}
