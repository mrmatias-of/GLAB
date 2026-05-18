const stats = [
  { value: "10+", label: "Anos de Experiência", detail: "no mercado de assistência" },
  { value: "20K+", label: "Aparelhos Reparados", detail: "smartphones, tablets e PCs" },
  { value: "500+", label: "Alunos Formados", detail: "em todo o Brasil" },
  { value: "98%", label: "Satisfação", detail: "dos alunos recomendam" },
]

export default function Stats() {
  return (
    <section className="relative py-2 overflow-hidden">
      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/25 to-transparent" />
      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/25 to-transparent" />

      <div className="relative bg-surface/40 backdrop-blur-sm border-y border-[rgba(0,212,200,0.08)]">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[rgba(0,212,200,0.08)]">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center text-center gap-1 py-8 px-4"
              >
                <span className="text-4xl md:text-5xl font-black text-cyan glow-text tabular-nums">
                  {s.value}
                </span>
                <span className="text-sm font-semibold text-foreground/90 mt-1">{s.label}</span>
                <span className="text-xs text-muted-foreground leading-relaxed hidden md:block">{s.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
