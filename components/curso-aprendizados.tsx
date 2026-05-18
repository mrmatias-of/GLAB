import { CheckCircle, Lightbulb } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"

export default function CursoAprendizados({ curso }: { curso: Curso }) {
  return (
    <section className="py-16 border-y border-border/50">
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex items-center gap-2 mb-8">
          <Lightbulb size={16} className="text-cyan" />
          <h2 className="text-lg font-black text-foreground tracking-wide uppercase text-sm">
            O que você vai aprender
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {curso.aprendizados.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface px-4 py-3.5 hover:border-cyan/20 transition-colors"
            >
              <CheckCircle size={16} className="text-cyan mt-0.5 shrink-0" />
              <span className="text-sm text-foreground/80 leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
