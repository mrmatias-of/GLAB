import { ArrowRight, Package, Smartphone, Monitor, Cpu, Layers, Zap, Radio, Settings, Wrench } from "lucide-react"
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
  if (tag?.toLowerCase().includes("pc") || tag?.toLowerCase().includes("gamer")) return Monitor
  if (tag?.toLowerCase().includes("consumo") || tag?.toLowerCase().includes("eletrico")) return Zap
  if (tag?.toLowerCase().includes("rf") || tag?.toLowerCase().includes("radio")) return Radio
  if (tag?.toLowerCase().includes("software")) return Settings
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

  return (
    <section id="cursos" className="relative py-8" style={{ backgroundColor: '#050510' }}>
      <div className="max-w-7xl mx-auto px-6">

        {cursos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-white/40 gap-3">
            <Package size={40} />
            <p className="text-sm">Nenhum curso disponivel no momento.</p>
          </div>
        )}

        {/* Grid de Cursos Numerados */}
        {cursos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Card Grupo VIP - PRIMEIRO */}
            <Link
              href="/grupo-vip"
              className="group relative rounded-xl overflow-hidden border border-green-500/30 bg-gradient-to-b from-green-950/30 to-[#050510] hover:border-green-400/50 transition-all h-fit"
            >
              {/* Image */}
              <div className="relative aspect-[3/2] bg-gradient-to-br from-green-600/20 to-emerald-600/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl">💬</div>
                  <span className="text-xs text-green-400 font-bold">GRUPO VIP</span>
                </div>
                
                {/* Number badge */}
                <div className="absolute top-3 left-3 w-7 h-7 rounded-md bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-green-400">00</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="text-sm font-bold text-white leading-tight mb-1 group-hover:text-green-400 transition-colors">
                  Grupo VIP
                </h3>
                <p className="text-xs text-white/40 line-clamp-1 mb-2">
                  Comunidade ativa
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-green-400">GRATIS</span>
                  <div className="w-5 h-5 rounded border border-green-500/30 bg-green-500/10 flex items-center justify-center">
                    <Users size={11} className="text-green-400" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Cards de Cursos */}
            {cursos.map((curso, index) => {
              const Icon = getIconByTag(curso.tag)
              return (
                <Link
                  key={curso.id}
                  href={`/cursos/${curso.slug}`}
                  className="group relative rounded-xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0a0a14] to-[#050510] hover:border-cyan-500/30 transition-all h-fit"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/2] bg-zinc-900/50">
                    {curso.imagem ? (
                      <Image
                        src={curso.imagem}
                        alt={curso.titulo}
                        fill
                        className="object-contain transition-transform duration-500 p-2"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-600/20 to-blue-600/10 flex items-center justify-center">
                        <Icon size={28} className="text-cyan-400/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent" />
                    
                    {/* Number badge */}
                    <div className="absolute top-3 left-3 w-7 h-7 rounded-md bg-black/60 border border-white/10 flex items-center justify-center">
                      <span className="text-[11px] font-bold text-white">{String(index + 1).padStart(2, '0')}</span>
                    </div>

                    {/* Destaque badge */}
                    {curso.destaque && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded text-[9px] font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600">
                          Popular
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-white leading-tight mb-1 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                      {curso.titulo}
                    </h3>
                    <p className="text-xs text-white/40 line-clamp-2 mb-2">
                      {curso.descricao}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        {curso.preco_original && (
                          <span className="text-[10px] text-white/30 line-through">{curso.preco_original}</span>
                        )}
                        <span className="text-sm font-black text-cyan-400">{curso.preco}</span>
                      </div>
                      <div className="w-5 h-5 rounded border border-white/10 bg-white/5 flex items-center justify-center">
                        <Icon size={11} className="text-cyan-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

// Import Users icon at top level for Grupo VIP card
import { Users } from "lucide-react"
