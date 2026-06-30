import Link from "next/link"
import Image from "next/image"
import { Package, MessageCircle } from "lucide-react"

interface Curso {
  id: string
  slug: string
  titulo: string
  descricao: string
  preco: string
  preco_original?: string
  imagem?: string
  destaque?: boolean
  tag?: string
}

function normalizeSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

export default function CursosCatalogo({ cursos }: { cursos: Curso[] }) {

  // Organizar por trilhas — slugs verificados contra os valores reais do Supabase
  const trilhas = [
    {
      id: "iniciantes",
      titulo: "Começando na assistência mobile",
      descricao: "Guias indicados para quem quer construir uma base prática nos serviços mais comuns da bancada.",
      slugs: [
        "combo-iniciante-mobile",
        "guia-troca-de-tela",
        "guia-troca-de-bateria",
        "guia-conectores-carga",
        "guia-software-celular",
      ],
    },
    {
      id: "diagnostico",
      titulo: "Diagnóstico e reparo avançado",
      descricao: "Conteúdos para técnicos que desejam evoluir em medições, análise e investigação de falhas mais complexas.",
      slugs: [
        "guia-diagnostico-avancado",
        "guia-consumo-eletrico",
        "guia-curto-em-placa",        // corrigido: era "guia-curto-placa"
        "guia-esquema-eletrico",
        "guia-pmic-alimentacao",
        "guia-radiofrequencia",
        "guia-falhas-intermitentes",
        "guia-perifericos",
      ],
    },
    {
      id: "gestao",
      titulo: "Gestão e profissionalização da bancada",
      descricao: "Organize processos, precifique melhor e desenvolva uma rotina mais profissional na assistência.",
      slugs: [
        "guia-precificacao-profissional", // corrigido: era "guia-precificacao"
        "guia-padronizacao-bancada",
      ],
    },
    {
      id: "pc-performance",
      titulo: "PC & Performance",
      descricao: "Conteúdo específico para otimização e desempenho de computadores.",
      slugs: ["guia-otimizacao-pc-gamer"],
    },
  ]

  // Mapear cursos às trilhas usando normalizeSlug em ambos os lados
  const trilhasComProdutos = trilhas.map(trilha => ({
    ...trilha,
    produtos: trilha.slugs
      .map(slug => cursos.find(c => normalizeSlug(c.slug) === normalizeSlug(slug)))
      .filter((c): c is Curso => !!c),
  }))

  // Fallback: produtos que não foram classificados em nenhuma trilha
  const slugsClassificados = new Set(trilhas.flatMap(t => t.slugs.map(s => normalizeSlug(s))))
  const naoClassificados = cursos.filter(c => !slugsClassificados.has(normalizeSlug(c.slug)))


  return (
    <section className="relative py-8 pt-0" style={{ backgroundColor: '#050510' }}>
      <div className="max-w-7xl mx-auto px-6">
        {cursos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-white/40 gap-3">
            <Package size={40} />
            <p className="text-sm">Nenhum guia foi carregado. Verifique a consulta ao catálogo.</p>
          </div>
        )}

        {cursos.length > 0 && (
          <>
            {/* Card Comunidade GJ */}
            <div className="mb-12">
              <a
                href="https://chat.whatsapp.com/KiK2TDOf1HzGlkgH8IEL4B"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-xl overflow-hidden border border-green-500/30 bg-gradient-to-b from-green-950/30 to-[#050510] hover:border-green-400/50 transition-all duration-300 hover:scale-105 max-w-xs"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-black flex-shrink-0">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2025%20de%20mai.%20de%202026%2C%2011_29_14-hzzSln2osQUTN0CuNRveCviyHzc89G.png"
                    alt="Comunidade GJ - Conecte-se. Aprenda. Compartilhe. Evolua."
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 left-3 w-7 h-7 rounded-md bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <span className="text-[11px] font-bold text-green-400">00</span>
                  </div>
                </div>

                <div className="p-3 flex flex-col gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight mb-1 group-hover:text-green-400 transition-colors">
                      Comunidade GJ
                    </h3>
                    <p className="text-xs text-white/40">
                      Conecte-se com técnicos, compartilhe experiências e evolua juntos.
                    </p>
                  </div>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                    <MessageCircle size={16} />
                    Quero participar
                  </button>
                </div>
              </a>
            </div>

            {/* Trilhas */}
            {trilhasComProdutos.filter(t => t.produtos.length > 0).map((trilha, trilhaIndex) => (
              <div key={trilhaIndex} id={trilha.id} className="mb-16 scroll-mt-20">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{trilha.titulo}</h2>
                  <p className="text-sm text-white/50">{trilha.descricao}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {trilha.produtos.map((curso, prodIndex) => {
                    const isCombo = curso.slug === "combo-iniciante-mobile"
                    return (
                      <Link
                        key={curso.id}
                        href={`/cursos/${curso.slug}`}
                        className="group relative rounded-xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0a0a14] to-[#050510] hover:border-blue-500/30 transition-all duration-300 hover:scale-105 h-fit"
                      >
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
                              <Package size={28} className="text-blue-400/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent" />
                          
                          <div className="absolute top-3 left-3 w-7 h-7 rounded-md bg-black/60 border border-white/10 flex items-center justify-center">
                            <span className="text-[11px] font-bold text-white">{String(prodIndex + 1).padStart(2, '0')}</span>
                          </div>

                          {isCombo && (
                            <div className="absolute top-3 right-3">
                              <span className="px-2.5 py-1 rounded text-[9px] font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600">
                                Melhor para começar
                              </span>
                            </div>
                          )}
                          {curso.destaque && !isCombo && (
                            <div className="absolute top-3 right-3">
                              <span className="px-2.5 py-1 rounded text-[9px] font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600">
                                Popular
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-3">
                          <h3 className="text-sm font-bold text-white leading-tight mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
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
                              <span className="text-sm font-black text-blue-400">{curso.preco}</span>
                            </div>
                            <div className="w-5 h-5 rounded border border-white/10 bg-white/5 flex items-center justify-center">
                              <Package size={11} className="text-blue-400" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Fallback: produtos não classificados em nenhuma trilha */}
            {naoClassificados.length > 0 && (
              <div id="outros-guias" className="mb-16 scroll-mt-20">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Outros guias</h2>
                  <p className="text-sm text-white/50">Conteúdos adicionais disponíveis no catálogo.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {naoClassificados.map((curso, prodIndex) => (
                    <Link
                      key={curso.id}
                      href={`/cursos/${curso.slug}`}
                      className="group relative rounded-xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0a0a14] to-[#050510] hover:border-blue-500/30 transition-all duration-300 hover:scale-105 h-fit"
                    >
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
                            <Package size={28} className="text-blue-400/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent" />
                        <div className="absolute top-3 left-3 w-7 h-7 rounded-md bg-black/60 border border-white/10 flex items-center justify-center">
                          <span className="text-[11px] font-bold text-white">{String(prodIndex + 1).padStart(2, '0')}</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-bold text-white leading-tight mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {curso.titulo}
                        </h3>
                        <p className="text-xs text-white/40 line-clamp-2 mb-2">{curso.descricao}</p>
                        <div className="flex items-baseline gap-1">
                          {curso.preco_original && (
                            <span className="text-[10px] text-white/30 line-through">{curso.preco_original}</span>
                          )}
                          <span className="text-sm font-black text-blue-400">{curso.preco}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
