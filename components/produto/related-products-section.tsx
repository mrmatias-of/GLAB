import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Layers } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"

export default function RelatedProductsSection({
  curso,
  todosCursos,
}: {
  curso: Curso
  todosCursos: Curso[]
}) {
  // Busca relacionados: usa a lista de slugs se disponível, senão usa mesma trilha
  let relacionados: Curso[] = []

  if (curso.relacionados && curso.relacionados.length > 0) {
    relacionados = curso.relacionados
      .map((slug) => todosCursos.find((c) => c.slug === slug))
      .filter((c): c is Curso => !!c)
      .slice(0, 3)
  } else if (curso.trilha) {
    relacionados = todosCursos
      .filter((c) => c.trilha === curso.trilha && c.slug !== curso.slug)
      .slice(0, 3)
  }

  if (relacionados.length === 0) return null

  return (
    <section className="py-16 relative" style={{ backgroundColor: "#050510" }}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,200,0.2), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: "#00d4c8" }}>
          Continue sua trilha
        </p>
        <h2 className="text-xl md:text-2xl font-black text-white mb-8">Guias relacionados</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {relacionados.map((rel) => (
            <Link
              key={rel.slug}
              href={`/cursos/${rel.slug}`}
              className="group relative rounded-2xl border border-white/8 overflow-hidden transition-all duration-300 hover:border-cyan-500/30 hover:scale-[1.01]"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(5,5,16,0.8) 100%)" }}
            >
              {rel.imagem ? (
                <div className="relative w-full aspect-video overflow-hidden border-b border-white/5">
                  <Image
                    src={rel.imagem}
                    alt={rel.titulo}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/70 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center border-b border-white/5" style={{ background: "rgba(0,212,200,0.04)" }}>
                  <Layers size={32} className="text-cyan-500/25" />
                </div>
              )}

              <div className="p-4">
                {rel.categoria && (
                  <p className="text-[10px] uppercase tracking-widest text-cyan-400/70 font-semibold mb-1">
                    {rel.categoria}
                  </p>
                )}
                <h3 className="text-sm font-black text-white mb-2 leading-tight">{rel.titulo}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-cyan-400">{rel.preco}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-white/40 group-hover:text-cyan-400 transition-colors">
                    Ver guia <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
