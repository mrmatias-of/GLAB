import Link from "next/link"
import { ArrowRight, ShieldCheck, Zap, Award } from "lucide-react"

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* === Background layers === */}

      {/* Deep radial glow - estilo mockup */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(0,212,200,0.18)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_100%_100%,rgba(0,140,255,0.08)_0%,transparent_60%)]" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,212,200,0.4) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Horizontal accent lines */}
      <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/15 to-transparent" />
      <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/10 to-transparent" />

      {/* Decorative glow orbs */}
      <div className="hidden md:block absolute top-1/3 left-1/4 w-64 h-64 bg-cyan/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* === Content === */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center pt-28 pb-20 flex flex-col items-center">

        {/* Badge pill */}
        <div className="animate-fade-up delay-100 inline-flex items-center gap-2.5 rounded-full border border-cyan/30 bg-cyan/10 px-5 py-2 mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(0,212,200,0.15)]">
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse shadow-[0_0_8px_rgba(0,212,200,0.8)]" />
          <span className="text-xs font-bold tracking-[0.15em] text-cyan uppercase">
            Guias Mestre &mdash; Assistência Técnica
          </span>
        </div>

        {/* Elegant script text */}
        <p className="animate-fade-up delay-150 text-cyan/80 text-lg md:text-xl font-light italic mb-3 tracking-wide">
          Profissional
        </p>

        {/* Headline */}
        <h1 className="animate-fade-up delay-200 text-4xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-5">
          <span className="text-foreground">Assistência Técnica</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-cyan to-blue-400 drop-shadow-[0_0_30px_rgba(0,212,200,0.5)]">
            de Alta Performance
          </span>
        </h1>

        {/* Sub */}
        <p className="animate-fade-up delay-300 text-sm md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl px-2">
          Guias técnicos criados por quem já reparou mais de{" "}
          <strong className="text-foreground font-semibold">20.000 aparelhos</strong>.
          Métodos testados na prática, direto para sua bancada.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up delay-400 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-14 w-full sm:w-auto">
          <Link
            href="/cursos"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-cyan/90 text-background font-bold text-sm hover:from-cyan/90 hover:to-cyan transition-all duration-300 shadow-[0_0_30px_rgba(0,212,200,0.4)] hover:shadow-[0_0_50px_rgba(0,212,200,0.6)]"
          >
            Explorar Cursos
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-foreground/90 hover:text-foreground hover:border-cyan/30 hover:bg-white/10 transition-all duration-300"
          >
            Falar Conosco
          </Link>
        </div>

        {/* Feature pills - estilo mockup com ícones circulares */}
        <div className="animate-fade-up delay-500 flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 backdrop-blur-sm hover:border-cyan/30 transition-all">
            <div className="w-8 h-8 rounded-full bg-cyan/15 border border-cyan/30 flex items-center justify-center shadow-[0_0_12px_rgba(0,212,200,0.3)]">
              <ShieldCheck size={14} className="text-cyan" />
            </div>
            <span className="text-xs font-medium text-foreground/80">Conteúdo Verificado</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 backdrop-blur-sm hover:border-cyan/30 transition-all">
            <div className="w-8 h-8 rounded-full bg-cyan/15 border border-cyan/30 flex items-center justify-center shadow-[0_0_12px_rgba(0,212,200,0.3)]">
              <Zap size={14} className="text-cyan" />
            </div>
            <span className="text-xs font-medium text-foreground/80">Resultados Imediatos</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 backdrop-blur-sm hover:border-cyan/30 transition-all">
            <div className="w-8 h-8 rounded-full bg-cyan/15 border border-cyan/30 flex items-center justify-center shadow-[0_0_12px_rgba(0,212,200,0.3)]">
              <Award size={14} className="text-cyan" />
            </div>
            <span className="text-xs font-medium text-foreground/80">20K+ Reparos</span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
