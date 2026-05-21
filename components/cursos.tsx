import { ArrowRight, Package, Smartphone, Monitor, Cpu, Layers } from "lucide-react"
import Image from "next/image"
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
  imagem: string | null
  ordem: number
}

const getIconByTag = (tag: string) => {
  if (tag?.toLowerCase().includes("mobile") || tag?.toLowerCase().includes("android")) return Smartphone
  if (tag?.toLowerCase().includes("pc") || tag?.toLowerCase().includes("windows")) return Monitor
  if (tag?.toLowerCase().includes("combo")) return Layers
  return Cpu
}

export default async function Cursos() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cursos")
    .select("id, slug, tag, titulo, descricao, preco, preco_original, cta_href, destaque, modulos, imagem, ordem")
    .eq("ativo", true)
    .order("ordem", { ascending: true })

  const cursos: CursoDB[] = error || !data ? [] : data
  const destaques = cursos.filter((c) => c.destaque)
  const secundarios = cursos.filter((c) => !c.destaque)

  return (
    <section id="cursos" className="relative py-28 overflow-hidden">
      <div className="absolute left-0 top-1/4 w-96 h-96 rounded-full bg-[#2563eb]/6 blur-[120px] pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-72 h-72 rounded-full bg-[#3b82f6]/6 blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(59,130,246,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <p className="text-[#3b82f6]/70 text-sm font-light italic mb-3 tracking-wide">Catálogo Completo</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            <span className="text-foreground">Escolha sua</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]">especialidade</span>
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
              className="relative rounded-2xl border border-[#3b82f6]/35 bg-[#080f1c] shadow-[0_0_60px_rgba(37,99,235,0.15)] mb-8 overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/60 to-transparent" />

              <div className="relative z-10 grid md:grid-cols-2 gap-0">
                {/* Imagem lado esquerdo em desktop, topo em mobile */}
                <div className="relative aspect-video md:aspect-auto md:min-h-[320px] overflow-hidden">
                  {cat.imagem ? (
                    <Image
                      src={cat.imagem}
                      alt={cat.titulo}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0d1a2e] to-[#04080f] flex items-center justify-center">
                      <Icon size={48} className="text-[#3b82f6]/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080f1c]/80 hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080f1c] via-transparent to-transparent md:hidden" />
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white text-[10px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Mais Popular
                    </div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6 md:p-10 flex flex-col justify-center">
                  <span className="text-xs font-bold tracking-widest text-[#3b82f6]/80 uppercase mb-2 block">{cat.tag}</span>
                  <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3">{cat.titulo}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{cat.descricao}</p>

                  <div className="flex items-baseline gap-2 mb-6">
                    {cat.preco_original && (
                      <span className="text-sm text-muted-foreground line-through">{cat.preco_original}</span>
                    )}
                    <span className="text-4xl font-black text-[#60a5fa] drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">{cat.preco}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                    {(cat.modulos ?? []).map((m) => (
                      <div key={m.titulo} className="flex items-center gap-2.5 rounded-lg bg-white/4 border border-white/8 px-3 py-2.5 hover:border-[#3b82f6]/30 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.5)] flex-shrink-0" />
                        <span className="text-xs text-foreground/80 leading-tight">{m.titulo}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/cursos/${cat.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-bold text-sm px-5 py-4 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white hover:from-[#1d4ed8] hover:to-[#2563eb] shadow-[0_0_30px_rgba(37,99,235,0.35)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] transition-all duration-300 group/btn"
                  >
                    Ver Guia Completo
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}

        {/* Cards Secundários */}
        {secundarios.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {secundarios.map((cat) => {
              const Icon = getIconByTag(cat.tag)
              return (
                <Link
                  key={cat.id}
                  href={`/cursos/${cat.slug}`}
                  className="group relative rounded-xl border border-white/8 bg-[#080f1c] hover:border-[#3b82f6]/35 hover:shadow-[0_0_35px_rgba(37,99,235,0.12)] transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video overflow-hidden">
                    {cat.imagem ? (
                      <Image
                        src={cat.imagem}
                        alt={cat.titulo}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0d1a2e] to-[#04080f] flex items-center justify-center">
                        <Icon size={28} className="text-[#3b82f6]/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080f1c] via-[#080f1c]/20 to-transparent" />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-bold tracking-widest text-[#3b82f6]/60 uppercase mb-1.5">{cat.tag}</span>
                    <h3 className="text-sm font-bold text-foreground mb-2 group-hover:text-[#60a5fa] transition-colors leading-snug">{cat.titulo}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">{cat.descricao}</p>

                    {/* Módulos preview */}
                    <div className="flex flex-col gap-1 mb-4">
                      {(cat.modulos ?? []).slice(0, 3).map((m) => (
                        <div key={m.titulo} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#3b82f6]/40 flex-shrink-0" />
                          <span className="text-[11px] text-foreground/45 truncate">{m.titulo}</span>
                        </div>
                      ))}
                      {(cat.modulos?.length ?? 0) > 3 && (
                        <span className="text-[10px] text-[#3b82f6]/50 ml-3">+{(cat.modulos?.length ?? 0) - 3} módulos</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-baseline gap-1.5">
                        {cat.preco_original && (
                          <span className="text-[10px] text-muted-foreground line-through">{cat.preco_original}</span>
                        )}
                        <span className="text-lg font-black text-[#60a5fa]">{cat.preco}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#2563eb]/10 border border-[#3b82f6]/25 flex items-center justify-center group-hover:bg-[#2563eb] group-hover:border-[#2563eb] transition-all duration-300">
                        <ArrowRight size={13} className="text-[#60a5fa] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className="mt-14 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          {["Moderno", "Prático", "Atualizado", "Profissional"].map((t, i, a) => (
            <span key={t} className="flex items-center gap-3">
              {t}
              {i < a.length - 1 && <span className="w-1 h-1 rounded-full bg-[#3b82f6]/40" />}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
