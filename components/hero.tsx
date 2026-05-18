import { BookOpen } from "lucide-react"

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Circuit board background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.82 0.18 185 / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.82 0.18 185 / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.82_0.18_185/0.08)_0%,transparent_70%)]" />

      {/* Card container */}
      <div className="relative z-10 mx-4 w-full max-w-2xl rounded-2xl border border-border bg-surface/60 backdrop-blur-sm p-8 md:p-12 text-center shadow-2xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-4 py-1.5 mb-6">
          <BookOpen size={13} className="text-cyan" />
          <span className="text-xs font-semibold tracking-widest text-cyan uppercase">G•Hub Cursos</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-balance mb-4">
          Transforme seu conhecimento em{" "}
          <span className="text-cyan">resultados reais.</span>
        </h1>

        {/* Sub */}
        <p className="text-base text-foreground/70 leading-relaxed mb-8 max-w-lg mx-auto">
          Guias técnicos práticos criados por quem já reparou mais de{" "}
          <strong className="text-foreground">20 mil aparelhos</strong>. Aprenda os métodos
          que funcionam de verdade no dia a dia da assistência técnica.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#cursos"
            className="inline-flex items-center gap-2 rounded-lg border border-foreground/30 bg-transparent px-6 py-3 text-sm font-semibold text-foreground hover:border-foreground transition-colors"
          >
            <BookOpen size={16} />
            Ver Cursos
            <span className="text-foreground/50">→</span>
          </a>
          <a
            href="#professor"
            className="inline-flex items-center gap-2 rounded-lg bg-surface border border-border px-6 py-3 text-sm font-semibold text-foreground/80 hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            Conhecer o Professor
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
