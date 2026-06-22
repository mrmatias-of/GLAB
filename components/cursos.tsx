import { ArrowRight, Package, Smartphone, Monitor, Cpu, Layers, Zap, Radio, Settings, Wrench, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/server"

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
  if (tag?.toLowerCase().includes("consumo") || tag?.toLowerCase().includes("elétrico")) return Zap
  if (tag?.toLowerCase().includes("rf") || tag?.toLowerCase().includes("radio")) return Radio
  if (tag?.toLowerCase().includes("software")) return Settings
  if (tag?.toLowerCase().includes("combo")) return Layers
  return Cpu
}

export default async function Cursos({ showComunidade = false }: { showComunidade?: boolean }) {
  const supabase = createAdminClient()
  
  let cursos: CursoDB[] = []
  
  if (supabase) {
    const { data, error } = await supabase
      .from("cursos")
      .select("id, slug, tag, titulo, descricao, preco, preco_original, cta_href, destaque, modulos, imagem, ordem")
      .eq("ativo", true)
      .order("ordem", { ascending: true })

    cursos = error || !data ? [] : data
  }

  // Organizar por trilhas e categorias
  const trilhas = {
    iniciantes: {
      id: "iniciantes",
      titulo: "Começando na assistência mobile",
      descricao: "Guias indicados para quem quer construir uma base prática nos serviços mais comuns da bancada.",
      produtos: cursos.filter(c => {
        const slugs = ["combo-iniciante-mobile", "guia-troca-de-tela", "guia-troca-de-bateria", "guia-conectores-carga", "guia-software-celular"];
        return slugs.includes(c.slug);
      })
    },
    diagnostico: {
      id: "diagnostico",
      titulo: "Diagnóstico e reparo avançado",
      descricao: "Conteúdos para técnicos que desejam evoluir em medições, análise e investigação de falhas mais complexas.",
      produtos: cursos.filter(c => {
        const slugs = ["guia-diagnostico-avancado", "guia-consumo-eletrico", "guia-curto-em-placa", "guia-esquema-eletrico", "guia-pmic-alimentacao", "guia-radiofrequencia", "guia-falhas-intermitentes", "guia-perifericos"];
        return slugs.includes(c.slug);
      })
    },
    gestao: {
      id: "gestao",
      titulo: "Gestão e profissionalização da bancada",
      descricao: "Organize processos, precifique melhor e desenvolva uma rotina mais profissional na assistência.",
      produtos: cursos.filter(c => {
        const slugs = ["guia-precificacao-profissional", "guia-padronizacao-bancada"];
        return slugs.includes(c.slug);
      })
    },
    pc: {
      id: "pc-performance",
      titulo: "PC & Performance",
      descricao: "Conteúdo específico para otimização e desempenho de computadores.",
      produtos: cursos.filter(c => {
        const slugs = ["guia-otimizacao-pc-gamer"];
        return slugs.includes(c.slug);
      })
    }
  }

  // Filter trilhas com produtos
  const trilhasAtivas = Object.values(trilhas).filter(t => t.produtos.length > 0)

  return (
    <section id="cursos" className="relative py-8 pt-16" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-6">

        {cursos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <Package size={40} />
            <p className="text-sm">Nenhum curso disponível no momento.</p>
          </div>
        )}

        {cursos.length > 0 && (
          <>
            {/* Card Comunidade GJ - apenas na home */}
            {showComunidade && (
              <div className="mb-12">
                <a
                  href="https://chat.whatsapp.com/KiK2TDOf1HzGlkgH8IEL4B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-xl overflow-hidden border border-green-200 bg-green-50 hover:border-green-400 transition-all duration-300 hover:scale-105 max-w-xs"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/2] overflow-hidden bg-black flex-shrink-0">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2025%20de%20mai.%20de%202026%2C%2011_29_14-hzzSln2osQUTN0CuNRveCviyHzc89G.png"
                      alt="Comunidade GJ - Conecte-se. Aprenda. Compartilhe. Evolua."
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Number badge */}
                    <div className="absolute top-3 left-3 w-7 h-7 rounded-md bg-green-100 border border-green-300 flex items-center justify-center">
                      <span className="text-[11px] font-bold text-green-700">00</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 flex flex-col gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1 group-hover:text-green-700 transition-colors">
                        Comunidade GJ
                      </h3>
                      <p className="text-xs text-gray-600">
                        Conecte-se com técnicos, compartilhe experiências e evolua juntos.
                      </p>
                    </div>

                    {/* WhatsApp Button */}
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                      <MessageCircle size={16} />
                      Quero participar
                    </button>
                  </div>
                </a>
              </div>
            )}

            {/* Trilhas */}
            {trilhasAtivas.map((trilha, trilhaIndex) => (
              <div key={trilhaIndex} id={trilha.id} className="mb-16 scroll-mt-20">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{trilha.titulo}</h2>
                  <p className="text-sm text-gray-600">{trilha.descricao}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {trilha.produtos.map((curso, index) => {
                    const Icon = getIconByTag(curso.tag)
                    const isCombo = curso.slug === "combo-iniciante-mobile"
                    return (
                      <Link
                        key={curso.id}
                        href={`/cursos/${curso.slug}`}
                        className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 hover:border-blue-400 transition-all duration-300 hover:scale-105 h-fit"
                      >
                        {/* Image */}
                        <div className="relative aspect-[3/2] bg-gray-100">
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
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                              <Icon size={28} className="text-blue-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-30" />
                          
                          {/* Number badge */}
                          <div className="absolute top-3 left-3 w-7 h-7 rounded-md bg-gray-900/60 border border-gray-700 flex items-center justify-center">
                            <span className="text-[11px] font-bold text-white">{String(index + 1).padStart(2, '0')}</span>
                          </div>

                          {/* Badges especiais */}
                          {isCombo && (
                            <div className="absolute top-3 right-3">
                              <span className="px-2.5 py-1 rounded text-[9px] font-bold text-white bg-green-600">
                                Melhor para começar
                              </span>
                            </div>
                          )}
                          {curso.destaque && !isCombo && (
                            <div className="absolute top-3 right-3">
                              <span className="px-2.5 py-1 rounded text-[9px] font-bold text-white bg-blue-600">
                                Popular
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3">
                          <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {curso.titulo}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {curso.descricao}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                              {curso.preco_original && (
                                <span className="text-[10px] text-gray-400 line-through">{curso.preco_original}</span>
                              )}
                              <span className="text-sm font-black text-blue-600">{curso.preco}</span>
                            </div>
                            <div className="w-5 h-5 rounded border border-gray-200 bg-gray-100 flex items-center justify-center">
                              <Icon size={11} className="text-blue-600" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  )
}

// Import Users icon at top level for Grupo VIP card
import { Users } from "lucide-react"
