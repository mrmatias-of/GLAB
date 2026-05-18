const stats = [
  { value: "10+", label: "Anos de Experiência" },
  { value: "20K+", label: "Aparelhos Reparados" },
  { value: "500+", label: "Alunos Formados" },
  { value: "98%", label: "Taxa de Satisfação" },
]

export default function Stats() {
  return (
    <section className="relative py-6 border-y border-border bg-surface/30 overflow-hidden">
      {/* subtle grid */}
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
      <div className="relative z-10 max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center text-center gap-1 py-4">
            <span className="text-3xl md:text-4xl font-extrabold text-cyan">{s.value}</span>
            <span className="text-xs text-foreground/60 leading-relaxed">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
