import { ArrowRight, ShieldCheck, Zap } from "lucide-react"

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* === Background layers === */}

      {/* Deep radial nebula */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,212,200,0.12)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(0,120,200,0.06)_0%,transparent_70%)]" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,212,200,0.35) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Horizontal line accent */}
      <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

      {/* Decorative spinning ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan/5 animate-spin-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-cyan/[0.03] animate-spin-slow pointer-events-none" style={{ animationDirection: "reverse", animationDuration: "30s" }} />

      {/* === Content === */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center pt-28 pb-20 flex flex-col items-center">

        {/* Badge */}
        <div className="animate-fade-up delay-100 inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/8 px-4 py-1.5 mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-glow" />
          <span className="text-xs font-semibold tracking-[0.2em] text-cyan uppercase">
            G•Hub Cursos &mdash; Guias Mestre
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up delay-200 text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight text-balance mb-6">
          Domine a{" "}
          <span className="relative inline-block">
            <span className="glow-text text-cyan">Assistência</span>
          </span>
          <br />
          <span className="text-foreground/90">Técnica de Ponta.</span>
        </h1>

        {/* Sub */}
        <p className="animate-fade-up delay-300 text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
          Guias técnicos criados por quem já reparou mais de{" "}
          <strong className="text-foreground font-semibold">20.000 aparelhos</strong>.
          Métodos que funcionam de verdade, direto na sua bancada.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up delay-400 flex flex-col sm:flex-row items-center gap-3 mb-14">
          <a
            href="#cursos"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-cyan text-background font-bold text-sm hover:bg-cyan/90 transition-all duration-300 shadow-[0_0_30px_rgba(0,212,200,0.4)] hover:shadow-[0_0_50px_rgba(0,212,200,0.55)]"
          >
            Explorar Cursos
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#professor"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-surface/50 backdrop-blur-sm text-sm font-medium text-foreground/80 hover:text-foreground hover:border-cyan/30 transition-all duration-300"
          >
            Conhecer o Professor
          </a>
        </div>

        {/* Trust badges */}
        <div className="animate-fade-up delay-500 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-cyan" />
            <span>Conteúdo Verificado</span>
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-cyan" />
            <span>Resultados Imediatos</span>
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-cyan font-bold">20K+</span>
            <span>Aparelhos Reparados</span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
