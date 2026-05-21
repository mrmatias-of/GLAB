import { ArrowRight, BookOpen, Package, Smartphone, Monitor, Cpu, Layers } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

type Modulo = { titulo: string; topicos: string[] }

type CursoDB = {
  id: string
  slug: string
  tag: string
  titulo: string
  descricao: string
  preco: string
  preco_original: string | null
  cta_href: string
  destaque: boolean
  modulos: Modulo[]
  ordem: number
}

const getIconByTag = (tag: string) => {
  if (tag?.toLowerCase().includes("iphone") || tag?.toLowerCase().includes("android") || tag?.toLowerCase().includes("mobile")) return Smartphone
  if (tag?.toLowerCase().includes("windows") || tag?.toLowerCase().includes("pc")) return Monitor
  if (tag?.toLowerCase().includes("combo")) return Layers
  return Cpu
}

export default async function Cursos() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cursos")
    .select("id, slug, tag, titulo, descricao, preco, preco_original, cta_href, destaque, modulos, ordem")
    .eq("ativo", true)
    .order("ordem", { ascending: true })

  const cursos: CursoDB[] = error || !data ? [] : data

  const destaques = cursos.filter((c) => c.destaque)
  const secundarios = cursos.filter((c) => !c.destaque)

  return (
    <section id="cursos" className="relative py-28 overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute left-0 top-1/4 w-96 h-96 rounded-full bg-cyan/8 blur-[120px] pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-72 h-72 rounded-full bg-blue-500/8 blur-[100px] pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,212,200,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <p className="text-cyan/70 text-sm font-light italic mb-3 tracking-wide">Catálogo Completo</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            <span className="text-foreground">Escolha sua</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-blue-400">especialidade</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md">
            Guias completos, passo a passo, criados para o profissional que quer resultados concretos.
          </p>
        </div>

        {cursos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <Package size={40} className="opacity-30" />
            <p className="text-sm">Nenhum curso disponível no momento.</p>
          </div>
        )}

        {/* Cards Destaque */}
        {destaques.map((cat) => {
          const Icon = getIconByTag(cat.tag)
          return (
            <div
              key={cat.id}
              className="relative rounded-2xl border border-cyan/40 bg-gradient-to-br from-[#0a1a28] to-[#060d14] shadow-[0_0_60px_rgba(0,212,200,0.15)] mb-8 overflow-hidden"
            >
              {/* Glow accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
              
              <div className="relative z-10 p-6 md:p-10 grid md:grid-cols-2 gap-6 md:gap-10 items-center">
                {/* Badge flutuante */}
                <div className="absolute top-4 right-4 md:top-6 md:right-7 z-20">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan to-cyan/80 text-background text-[10px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(0,212,200,0.5)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-background animate-pulse" />
                    Mais Popular
                  </div>
                </div>

                {/* Left */}
                <div>
                  {/* Icon circular grande */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-b from-cyan/25 to-cyan/5 border border-cyan/40 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(0,212,200,0.3)]">
                    <Icon size={28} className="text-cyan" />
                  </div>
                  
                  <span className="text-xs font-bold tracking-widest text-cyan/80 uppercase mb-2 block">{cat.tag}</span>
                  <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3 pr-20 md:pr-0">{cat.titulo}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{cat.descricao}</p>
                  
                  <div className="flex items-baseline gap-2">
                    {cat.preco_original && (
                      <span className="text-sm text-muted-foreground line-through">{cat.preco_original}</span>
                    )}
                    <span className="text-4xl font-black text-cyan drop-shadow-[0_0_20px_rgba(0,212,200,0.4)]">{cat.preco}</span>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(cat.modulos ?? []).map((m) => (
                      <div key={m.titulo} className="flex items-center gap-2.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 hover:border-cyan/30 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,212,200,0.5)]" />
                        <span className="text-xs text-foreground/80 leading-tight">{m.titulo}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/cursos/${cat.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-bold text-sm px-5 py-4 bg-gradient-to-r from-cyan to-cyan/80 text-background hover:from-cyan/90 hover:to-cyan shadow-[0_0_30px_rgba(0,212,200,0.35)] hover:shadow-[0_0_50px_rgba(0,212,200,0.5)] transition-all duration-300 group/btn"
                  >
                    Ver Guia Completo
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}

        {/* Cards Secundários - estilo mockup */}
        {secundarios.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {secundarios.map((cat) => {
              const Icon = getIconByTag(cat.tag)
              return (
                <Link
                  key={cat.id}
                  href={`/cursos/${cat.slug}`}
                  className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#0d1118] to-[#080c10] hover:border-cyan/30 hover:shadow-[0_0_40px_rgba(0,212,200,0.1)] transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="p-6 flex flex-col flex-1 relative z-10">
                    {/* Icon circular */}
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:bg-cyan/15 group-hover:border-cyan/30 group-hover:shadow-[0_0_25px_rgba(0,212,200,0.25)] transition-all duration-300">
                      <Icon size={24} className="text-white/50 group-hover:text-cyan transition-colors" />
                    </div>

                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">{cat.tag}</span>
                    <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-cyan transition-colors">{cat.titulo}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-5 flex-1 line-clamp-2">{cat.descricao}</p>
                    
                    {/* Módulos preview */}
                    <div className="flex flex-col gap-1 mb-5">
                      {(cat.modulos ?? []).slice(0, 3).map((m) => (
                        <div key={m.titulo} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-cyan/40" />
                          <span className="text-[11px] text-foreground/50">{m.titulo}</span>
                        </div>
                      ))}
                      {(cat.modulos?.length ?? 0) > 3 && (
                        <span className="text-[10px] text-cyan/60 ml-3">+{(cat.modulos?.length ?? 0) - 3} módulos</span>
                      )}
                    </div>

                    {/* Price + Arrow */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-baseline gap-1.5">
                        {cat.preco_original && (
                          <span className="text-[10px] text-muted-foreground line-through">{cat.preco_original}</span>
                        )}
                        <span className="text-xl font-black text-cyan">{cat.preco}</span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan group-hover:border-cyan transition-all duration-300">
                        <ArrowRight size={14} className="text-white/40 group-hover:text-background transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Bottom tagline */}
        <div className="mt-14 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <span>Moderno</span>
          <span className="w-1 h-1 rounded-full bg-cyan/50" />
          <span>Prático</span>
          <span className="w-1 h-1 rounded-full bg-cyan/50" />
          <span>Atualizado</span>
          <span className="w-1 h-1 rounded-full bg-cyan/50" />
          <span>Profissional</span>
        </div>
      </div>
    </section>
  )
}
