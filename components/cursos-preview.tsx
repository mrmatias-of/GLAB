import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Layers, Cpu, Smartphone, Monitor } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

const getIconByTag = (tag: string) => {
  if (tag?.toLowerCase().includes("mobile") || tag?.toLowerCase().includes("android")) return Smartphone
  if (tag?.toLowerCase().includes("pc") || tag?.toLowerCase().includes("windows")) return Monitor
  if (tag?.toLowerCase().includes("combo")) return Layers
  return Cpu
}

export default async function CursosPreview() {
  const supabase = await createClient()
  const { data: cursos } = await supabase
    .from("cursos")
    .select("id, slug, tag, titulo, descricao, preco, preco_original, destaque, imagem")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(4)

  if (!cursos?.length) return null

  const destaque = cursos.find(c => c.destaque) || cursos[0]
  const outros = cursos.filter(c => c.id !== destaque.id)

  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-violet-400 text-xs uppercase tracking-widest mb-3">Nossos Guias</p>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Comece a aprender
            </h2>
          </div>
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            Ver todos
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Layout: destaque grande + lista lateral */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Card destaque grande */}
          <Link
            href={`/cursos/${destaque.slug}`}
            className="lg:col-span-3 group relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] aspect-[4/3] lg:aspect-auto lg:min-h-[450px]"
          >
            {destaque.imagem ? (
              <Image
                src={destaque.imagem}
                alt={destaque.titulo}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-600/30 to-purple-600/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {/* Badge */}
            {destaque.destaque && (
              <div className="absolute top-6 left-6">
                <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg">
                  Mais Popular
                </span>
              </div>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-violet-400 text-xs uppercase tracking-widest mb-2">{destaque.tag}</p>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3">{destaque.titulo}</h3>
              <p className="text-white/60 text-sm mb-4 line-clamp-2 max-w-lg">{destaque.descricao}</p>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-violet-400">{destaque.preco}</span>
                {destaque.preco_original && (
                  <span className="text-sm text-white/40 line-through">{destaque.preco_original}</span>
                )}
              </div>
            </div>
          </Link>

          {/* Cards menores */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {outros.map((c) => {
              const Icon = getIconByTag(c.tag)
              return (
                <Link
                  key={c.id}
                  href={`/cursos/${c.slug}`}
                  className="group flex gap-4 rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 hover:border-violet-500/30 hover:bg-[#111] transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    {c.imagem ? (
                      <Image
                        src={c.imagem}
                        alt={c.titulo}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-600/20 to-purple-600/10 flex items-center justify-center">
                        <Icon size={24} className="text-violet-400/50" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <p className="text-[10px] text-violet-400/70 uppercase tracking-widest mb-1">{c.tag}</p>
                    <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-2 mb-2">
                      {c.titulo}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-violet-400">{c.preco}</span>
                      {c.preco_original && (
                        <span className="text-xs text-white/40 line-through">{c.preco_original}</span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-violet-500/50 group-hover:bg-violet-500/10 transition-all">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          >
            Ver Todos os Guias
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
