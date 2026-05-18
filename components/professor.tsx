import { CheckCircle2, Award, Users, Wrench } from "lucide-react"

const conquistas = [
  { icon: Wrench, label: "20.000+", desc: "aparelhos reparados" },
  { icon: Users, label: "500+", desc: "alunos treinados" },
  { icon: Award, label: "10 anos", desc: "de experiência prática" },
]

const aprendizados = [
  "Método testado em mais de 20 mil reparos reais",
  "Procedimentos que eliminam retorno de clientes",
  "Diagnósticos precisos que economizam tempo e peças",
  "Técnicas aplicáveis em iPhone, Android e Windows",
]

export default function Professor() {
  return (
    <section id="professor" className="relative py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full bg-cyan/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-[400px] h-[400px] rounded-full bg-blue-500/4 blur-[100px] pointer-events-none" />

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
        <div className="flex flex-col items-start mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/8 px-4 py-1.5 mb-5">
            <Award size={12} className="text-cyan" />
            <span className="text-xs font-semibold tracking-[0.18em] text-cyan uppercase">Sobre o Professor</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-balance leading-tight">
            O <span className="text-cyan glow-text">Professor</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Left: bio + conquistas */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            {/* Bio card */}
            <div className="rounded-2xl border border-[rgba(0,212,200,0.1)] bg-surface/60 backdrop-blur-sm p-8 card-premium">
              <p className="text-foreground/75 leading-[1.8] text-base mb-4">
                Com mais de{" "}
                <strong className="text-foreground">10 anos de experiência</strong> no mercado de assistência técnica,
                Um conhecimento construído na prática — reparando
                smartphones, tablets e computadores de clientes reais, com
                problemas reais.
              </p>
              <p className="text-foreground/75 leading-[1.8] text-base">
                Sua metodologia foi desenvolvida resolvendo os casos mais complexos
                do cotidiano. Hoje ele compartilha esse arsenal técnico em guias
                diretos, sem enrolação, para você aplicar imediatamente.
              </p>
            </div>

            {/* Conquistas */}
            <div className="grid grid-cols-3 gap-4">
              {conquistas.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="rounded-xl border border-[rgba(0,212,200,0.1)] bg-surface/40 p-5 flex flex-col gap-2 hover:border-cyan/25 hover:bg-surface transition-all duration-300 card-premium"
                >
                  <Icon size={18} className="text-cyan" strokeWidth={1.5} />
                  <span className="text-xl font-black text-foreground">{label}</span>
                  <span className="text-xs text-muted-foreground leading-relaxed">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: what you learn */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-cyan/15 bg-gradient-to-b from-surface to-[#0b1a2a] p-8 card-premium shadow-[0_0_40px_rgba(0,212,200,0.06)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-cyan/15 border border-cyan/25 flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-cyan" />
                </div>
                <span className="text-sm font-bold text-foreground tracking-wide">O que você domina</span>
              </div>

              <ul className="flex flex-col gap-5">
                {aprendizados.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-cyan/15 border border-cyan/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={11} className="text-cyan" />
                    </div>
                    <span className="text-sm text-foreground/80 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-[rgba(0,212,200,0.1)]">
                <a
                  href="#cursos"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan text-background font-bold text-sm px-5 py-3.5 hover:bg-cyan/90 transition-all duration-300 shadow-[0_0_24px_rgba(0,212,200,0.3)]"
                >
                  Ver Cursos Disponíveis
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
