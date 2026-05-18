import { Smartphone, Monitor, ArrowRight } from "lucide-react"

const categorias = [
  {
    icon: Smartphone,
    titulo: "Cursos Mobile",
    descricao: "Troca de Tela, Bateria, Carga e Software para iPhone e Android",
    href: "#",
  },
  {
    icon: Monitor,
    titulo: "Cursos Windows",
    descricao: "Formatação profissional com backup, drivers e otimização",
    href: "#",
  },
]

export default function Cursos() {
  return (
    <section id="cursos" className="relative py-20 overflow-hidden">
      {/* glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan/5 blur-3xl pointer-events-none" />

      {/* circuit pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.82 0.18 185 / 1) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.82 0.18 185 / 1) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-balance mb-3">
            Categorias de{" "}
            <span className="text-cyan">Cursos</span>
          </h2>
          <p className="text-foreground/60 text-base">Escolha a área que você quer dominar</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {categorias.map((cat) => {
            const Icon = cat.icon
            return (
              <div
                key={cat.titulo}
                className="group rounded-2xl border border-border bg-surface p-8 hover:border-cyan/40 hover:bg-surface-hover transition-all duration-300"
              >
                <Icon size={36} className="text-cyan mb-5" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-foreground mb-2">{cat.titulo}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed mb-6">{cat.descricao}</p>
                <a
                  href={cat.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:gap-3 transition-all duration-200"
                >
                  Ver cursos
                  <ArrowRight size={15} />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
