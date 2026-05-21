import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function CursosPreview() {
  const supabase = await createClient()
  const { data: cursos } = await supabase
    .from("cursos")
    .select("id, slug, tag, titulo, descricao, preco, preco_original, destaque, cta_href")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(3)

  if (!cursos?.length) return null

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(0,212,200,0.05)_0%,transparent_70%)]" />

      <div className="relative max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/5 px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-glow" />
              <span className="text-xs font-semibold tracking-widest text-cyan uppercase">Guias Disponíveis</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-balance leading-tight">
              Comece a aprender{" "}
              <span className="text-cyan glow-text">agora mesmo</span>
            </h2>
          </div>
          <Link
            href="/cursos"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:text-foreground transition-colors shrink-0"
          >
            Ver todos os guias
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {cursos.map((c) => (
            <div
              key={c.id}
              className={`group relative rounded-2xl border bg-gradient-to-b transition-all duration-300 card-premium flex flex-col ${
                c.destaque
                  ? "border-cyan/30 from-[#0d1e2e] to-surface hover:shadow-[0_0_40px_rgba(0,212,200,0.15)]"
                  : "border-[rgba(0,212,200,0.1)] from-surface to-[#0b1320] hover:border-cyan/20"
              }`}
            >
              <span className="shimmer-inner" />
              <div className="relative z-10 p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-widest text-cyan uppercase">{c.tag}</span>
                  {c.destaque && (
                    <span className="text-[10px] font-black tracking-widest text-background bg-cyan px-2 py-0.5 rounded-full"
                      style={{ animation: "float 3s ease-in-out infinite" }}>
                      POPULAR
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-foreground mb-2">{c.titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{c.descricao}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    {c.preco_original && (
                      <span className="text-xs text-muted-foreground line-through">{c.preco_original}</span>
                    )}
                    <span className="text-xl font-black text-cyan">{c.preco}</span>
                  </div>
                  <Link
                    href={`/cursos/${c.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-background bg-cyan px-3 py-2 rounded-lg hover:bg-cyan/90 transition-all"
                  >
                    Ver Guia
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA bottom */}
        <div className="mt-10 text-center">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-cyan/25 text-cyan text-sm font-semibold hover:bg-cyan/10 hover:border-cyan/40 transition-all duration-300 group"
          >
            Ver todos os guias disponíveis
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
