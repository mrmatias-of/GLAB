import { UserCircle, CheckCircle2 } from "lucide-react"

const aprendizados = [
  "Método testado em mais de 20 mil reparos reais",
  "Procedimentos que reduzem retorno de clientes",
  "Diagnósticos precisos que economizam tempo e peças",
  "Aplicável em iPhone, Android e Windows",
]

export default function Professor() {
  return (
    <section id="professor" className="relative py-20 overflow-hidden">
      {/* glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-4 py-1.5 mb-8">
          <UserCircle size={13} className="text-cyan" />
          <span className="text-xs font-semibold tracking-widest text-cyan uppercase">Sobre o Professor</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: bio */}
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6 text-balance">
              Guilherme Julião
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              Com mais de{" "}
              <strong className="text-foreground">10 anos de experiência</strong> no mercado de
              assistência técnica, Guilherme já reparou mais de{" "}
              <strong className="text-foreground">20 mil aparelhos</strong> entre smartphones,
              tablets e computadores.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              Sua metodologia foi desenvolvida na prática, resolvendo os problemas mais comuns
              e mais complexos do dia a dia. Agora, ele compartilha esse conhecimento em guias
              diretos, sem enrolação, para você aplicar imediatamente na sua bancada.
            </p>
          </div>

          {/* Right: what you learn */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 mb-5">
              <CheckCircle2 size={12} className="text-cyan" />
              <span className="text-xs font-semibold tracking-widest text-cyan uppercase">O que você aprende</span>
            </div>

            <ul className="flex flex-col gap-4">
              {aprendizados.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-cyan mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground/80 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="#cursos"
              className="mt-6 w-full inline-flex items-center justify-center rounded-lg bg-cyan text-background font-bold text-sm px-5 py-3 hover:opacity-90 transition-opacity"
            >
              Ver Cursos Disponíveis
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
