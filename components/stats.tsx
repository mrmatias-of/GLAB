export default function Stats() {
  const stats = [
    { value: "30", label: "Guias disponíveis" },
    { value: "1 000+", label: "Alunos ativos" },
  ]

  const features = [
    { value: "5 anos", label: "de experiência" },
    { value: "2 horas", label: "tempo médio de estudo" },
  ]

  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Label */}
        <p className="text-white/40 text-xs uppercase tracking-widest mb-8">
          G-Lab Cursos
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Stats grandes */}
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 md:p-8"
            >
              <p className="text-4xl md:text-5xl font-black text-white mb-2">{s.value}</p>
              <p className="text-sm text-white/50">{s.label}</p>
            </div>
          ))}

          {/* Bloco de texto */}
          <div className="col-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 to-purple-600/10 p-6 md:p-8 flex flex-col justify-center">
            <p className="text-2xl md:text-3xl font-black text-white mb-2">
              Suporte
              <br />
              <span className="text-violet-400">24 horas</span>
            </p>
            <p className="text-sm text-white/50">
              Tire suas dúvidas a qualquer momento com nossa equipe de suporte dedicada.
            </p>
          </div>

          {/* Features menores */}
          {features.map((f) => (
            <div
              key={f.label}
              className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6"
            >
              <p className="text-2xl md:text-3xl font-black text-white mb-1">{f.value}</p>
              <p className="text-xs text-white/50">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
