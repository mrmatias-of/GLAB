import { Smartphone, Monitor, Cpu, HeadphonesIcon } from "lucide-react"

const stats = [
  { value: "20K+", label: "Reparos", icon: Smartphone },
  { value: "98%", label: "Satisfação", icon: HeadphonesIcon },
  { value: "500+", label: "Alunos", icon: Cpu },
  { value: "10+", label: "Anos", icon: Monitor },
]

export default function Stats() {
  return (
    <section className="relative py-6 overflow-hidden">
      {/* Glow line top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-5">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-0 md:justify-between">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex items-center gap-3 group"
            >
              {/* Ícone circular com glow - estilo mockup */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-b from-cyan/20 to-cyan/5 border border-cyan/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,212,200,0.25)] group-hover:shadow-[0_0_30px_rgba(0,212,200,0.4)] transition-all duration-300">
                <s.icon size={20} className="text-cyan" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-foreground tabular-nums">
                  {s.value}
                </span>
                <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
              </div>
              
              {/* Separator - hidden on last item and mobile */}
              {i < stats.length - 1 && (
                <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent ml-6 md:ml-10" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Glow line bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
    </section>
  )
}
