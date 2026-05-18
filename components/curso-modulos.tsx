import { BookOpen, PlayCircle } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"

export default function CursoModulos({ curso }: { curso: Curso }) {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-10">
          <BookOpen size={16} className="text-cyan" />
          <h2 className="text-lg font-black text-foreground tracking-wide uppercase text-sm">
            Conteúdo do curso
          </h2>
          <span className="ml-auto text-xs text-muted-foreground">
            {curso.modulos.length} módulos &middot;{" "}
            {curso.modulos.reduce((acc, m) => acc + m.aulas.length, 0)} aulas
          </span>
        </div>

        {/* Módulos */}
        <div className="flex flex-col gap-4">
          {curso.modulos.map((modulo, i) => (
            <div
              key={modulo.titulo}
              className="rounded-2xl border border-border/60 bg-surface overflow-hidden hover:border-cyan/20 transition-colors"
            >
              {/* Módulo header */}
              <div className="flex items-center gap-4 px-6 py-4 border-b border-border/40">
                <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-cyan">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-bold text-foreground text-sm">{modulo.titulo}</h3>
                <span className="ml-auto text-xs text-muted-foreground shrink-0">
                  {modulo.aulas.length} aulas
                </span>
              </div>

              {/* Aulas */}
              <div className="flex flex-col divide-y divide-border/30">
                {modulo.aulas.map((aula) => (
                  <div key={aula} className="flex items-center gap-3 px-6 py-3">
                    <PlayCircle size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">{aula}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
