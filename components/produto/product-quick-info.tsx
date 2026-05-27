import { BookOpen, Zap, Award, Clock, BarChart2 } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"

export default function ProductQuickInfo({ curso }: { curso: Curso }) {
  const totalTopicos = curso.modulos.reduce((acc, m) => acc + m.topicos.length, 0)
  const nivelLabel = curso.nivel
    ? curso.nivel.charAt(0).toUpperCase() + curso.nivel.slice(1)
    : "Iniciante"

  const items = [
    { icon: BarChart2, label: "Nível", value: nivelLabel },
    { icon: BookOpen, label: "Módulos", value: String(curso.modulos.length) },
    { icon: Zap, label: "Tópicos", value: String(totalTopicos) },
    { icon: Clock, label: "Acesso", value: "Vitalício" },
    { icon: Award, label: "Certificado", value: "Digital" },
  ].filter((item) => item.value && item.value !== "0")

  return (
    <section
      className="py-0 relative"
      style={{ backgroundColor: "#050510" }}
    >
      <div
        className="w-full border-y border-white/5"
        style={{ background: "rgba(0,212,200,0.03)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-0 divide-x divide-white/5">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-6 py-5"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-cyan-500/20 shrink-0"
                  style={{ background: "rgba(0,212,200,0.06)" }}
                >
                  <item.icon size={15} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/35 uppercase tracking-widest font-semibold">
                    {item.label}
                  </p>
                  <p className="text-sm font-black text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
