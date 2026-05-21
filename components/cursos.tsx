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
    <section id="cursos" className="relative py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-violet-400 text-xs uppercase tracking-widest mb-4">Catalogo Completo</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Escolha sua especialidade
          </h2>
          <p className="text-white/50 max-w-md mx-auto">
            Guias completos, passo a passo, criados para o profissional que quer resultados.
          </p>
        </div>

        {cursos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-white/40 gap-3">
            <Package size={40} />
            <p className="text-sm">Nenhum curso disponivel no momento.</p>
          </div>
        )}

        {/* Cards Destaque */}
        {destaques.map((cat) => {
          const Icon = getIconByTag(cat.tag)
          return (
            <div
              key={cat.id}
              className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] mb-8"
            >
              <div className="grid md:grid-cols-2">
              {/* Imagem */}
              <div className="relative aspect-video md:aspect-auto md:min-h-[400px] bg-zinc-900">
                {cat.imagem ? (
                  <Image
                    src={cat.imagem}
                    alt={cat.titulo}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-600/30 to-purple-600/20 flex items-center justify-center">
                    <Icon size={48} className="text-violet-400/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a] hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:hidden" />
                  
                  {/* Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg">
                      Mais Popular
                    </span>
                  </div>
                </div>

                {/* Conteudo */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <p className="text-violet-400 text-xs uppercase tracking-widest mb-3">{cat.tag}</p>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4">{cat.titulo}</h3>
                  <p className="text-white/50 leading-relaxed mb-8">{cat.descricao}</p>

                  <div className="flex items-baseline gap-3 mb-8">
                    {cat.preco_original && (
                      <span className="text-lg text-white/40 line-through">{cat.preco_original}</span>
                    )}
                    <span className="text-4xl font-black text-violet-400">{cat.preco}</span>
                  </div>

                  {/* Modulos */}
                  <div className="grid grid-cols-2 gap-2 mb-8">
                    {(cat.modulos ?? []).slice(0, 6).map((m) => (
                      <div key={m.titulo} className="flex items-center gap-2 text-sm text-white/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        <span className="truncate">{m.titulo}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/cursos/${cat.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                  >
                    Ver Guia Completo
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}

        {/* Cards Secundarios - Grid de produtos */}
        {secundarios.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {secundarios.map((cat) => {
              const Icon = getIconByTag(cat.tag)
              return (
                <Link
                  key={cat.id}
                  href={`/cursos/${cat.slug}`}
                  className="group relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] hover:border-violet-500/30 transition-all flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-zinc-900">
                    {cat.imagem ? (
                      <Image
                        src={cat.imagem}
                        alt={cat.titulo}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        placeholder="empty"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-600/20 to-purple-600/10 flex items-center justify-center">
                        <Icon size={32} className="text-violet-400/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-[10px] text-violet-400/70 uppercase tracking-widest mb-2">{cat.tag}</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors mb-2">
                      {cat.titulo}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed mb-4 flex-1 line-clamp-2">
                      {cat.descricao}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-baseline gap-2">
                        {cat.preco_original && (
                          <span className="text-xs text-white/40 line-through">{cat.preco_original}</span>
                        )}
                        <span className="text-xl font-black text-violet-400">{cat.preco}</span>
                      </div>
                      <span className="px-4 py-2 rounded-full text-xs font-medium text-white border border-white/20 group-hover:bg-violet-600 group-hover:border-violet-600 transition-all">
                        Ver mais
                      </span>
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
