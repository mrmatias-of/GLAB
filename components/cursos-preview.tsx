import Link from "next/link"
import { ArrowRight, Smartphone, Monitor, Cpu, Layers } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

const getIconByTag = (tag: string) => {
  if (tag?.toLowerCase().includes("iphone") || tag?.toLowerCase().includes("android") || tag?.toLowerCase().includes("mobile")) return Smartphone
  if (tag?.toLowerCase().includes("windows") || tag?.toLowerCase().includes("pc")) return Monitor
  if (tag?.toLowerCase().includes("combo")) return Layers
  return Cpu
}

export default async function CursosPreview() {
  const supabase = await createClient()
  const { data: cursos } = await supabase
    .from("cursos")
    .select("id, slug, tag, titulo, descricao, preco, preco_original, destaque, cta_href")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(4)

  if (!cursos?.length) return null

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(0,212,200,0.08)_0%,transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <p className="text-cyan/70 text-sm font-light italic mb-2 tracking-wide">Nossos Cursos</p>
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              <span className="text-foreground">Comece a aprender</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-blue-400">agora mesmo</span>
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

        {/* Cards - estilo mockup com ícones circulares */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cursos.map((c) => {
            const Icon = getIconByTag(c.tag)
            return (
              <Link
                key={c.id}
                href={`/cursos/${c.slug}`}
                className={`group relative rounded-2xl border bg-gradient-to-b transition-all duration-300 flex flex-col overflow-hidden ${
                  c.destaque
                    ? "border-cyan/40 from-[#0a1a28] to-[#060d14] shadow-[0_0_30px_rgba(0,212,200,0.1)] hover:shadow-[0_0_50px_rgba(0,212,200,0.2)]"
                    : "border-white/10 from-[#0d1118] to-[#080c10] hover:border-cyan/30"
                }`}
              >
                {/* Glow overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 p-6 flex flex-col flex-1">
                  {/* Icon circular com glow */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-all duration-300 ${
                    c.destaque 
                      ? "bg-gradient-to-b from-cyan/25 to-cyan/10 border border-cyan/40 shadow-[0_0_25px_rgba(0,212,200,0.35)] group-hover:shadow-[0_0_35px_rgba(0,212,200,0.5)]"
                      : "bg-white/5 border border-white/10 group-hover:border-cyan/30 group-hover:bg-cyan/10 group-hover:shadow-[0_0_20px_rgba(0,212,200,0.2)]"
                  }`}>
                    <Icon size={24} className={c.destaque ? "text-cyan" : "text-white/60 group-hover:text-cyan transition-colors"} />
                  </div>

                  {/* Tag + Popular badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold tracking-widest text-cyan/80 uppercase">{c.tag}</span>
                    {c.destaque && (
                      <span className="text-[9px] font-black tracking-wider text-background bg-cyan px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(0,212,200,0.4)]">
                        POPULAR
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-cyan transition-colors line-clamp-2">
                    {c.titulo}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed mb-5 flex-1 line-clamp-3">
                    {c.descricao}
                  </p>

                  {/* Price + Arrow */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      {c.preco_original && (
                        <span className="text-[10px] text-muted-foreground line-through">{c.preco_original}</span>
                      )}
                      <span className="text-lg font-black text-cyan">{c.preco}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center group-hover:bg-cyan group-hover:border-cyan transition-all duration-300">
                      <ArrowRight size={14} className="text-cyan group-hover:text-background transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Bottom tagline */}
        <div className="mt-12 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <span>Moderno</span>
          <span className="w-1 h-1 rounded-full bg-cyan/50" />
          <span>Prático</span>
          <span className="w-1 h-1 rounded-full bg-cyan/50" />
          <span>Atualizado</span>
          <span className="w-1 h-1 rounded-full bg-cyan/50" />
          <span>Profissional</span>
        </div>

        {/* CTA bottom */}
        <div className="mt-8 text-center">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan to-cyan/80 text-background text-sm font-bold hover:from-cyan/90 hover:to-cyan transition-all duration-300 shadow-[0_0_25px_rgba(0,212,200,0.3)] hover:shadow-[0_0_40px_rgba(0,212,200,0.5)] group"
          >
            Ver Todos os Cursos
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
