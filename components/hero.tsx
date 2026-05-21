import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function Hero() {
  const supabase = await createClient()
  const { data: cursos } = await supabase
    .from("cursos")
    .select("id, slug, titulo, imagem, preco")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(5)

  return (
    <section className="relative min-h-screen pt-28 pb-20 overflow-hidden">
      {/* Gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-violet-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6">
              <span className="text-white">Domine a</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400">
                Assistencia Tecnica
              </span>
            </h1>
            <p className="text-lg text-white/50 leading-relaxed mb-8 max-w-md">
              Guias tecnicos criados por quem ja reparou mais de 20.000 aparelhos. Metodos testados na pratica.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)]"
              >
                Explorar Cursos
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white/80 font-medium border border-white/10 hover:bg-white/5 transition-all"
              >
                Falar Conosco
              </Link>
            </div>
          </div>

          {/* Right - Carousel de cursos */}
          <div className="relative">
            {/* Cards empilhados com perspectiva */}
            <div className="relative h-[400px]">
              {cursos?.slice(0, 3).map((curso, i) => (
                <Link
                  key={curso.id}
                  href={`/cursos/${curso.slug}`}
                  className="absolute rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl transition-all duration-500 hover:scale-105"
                  style={{
                    width: i === 0 ? "100%" : i === 1 ? "85%" : "70%",
                    height: i === 0 ? "100%" : i === 1 ? "85%" : "70%",
                    right: i === 0 ? "0" : i === 1 ? "8%" : "16%",
                    top: i === 0 ? "0" : i === 1 ? "8%" : "16%",
                    zIndex: 3 - i,
                    opacity: i === 0 ? 1 : i === 1 ? 0.7 : 0.4,
                  }}
                >
                  {curso.imagem && (
                    <Image
                      src={curso.imagem}
                      alt={curso.titulo}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={i === 0}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {i === 0 && (
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-white font-bold text-lg mb-1">{curso.titulo}</p>
                      <p className="text-violet-400 font-bold">{curso.preco}</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Mini cards laterais */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
              {cursos?.slice(3, 5).map((curso) => (
                <Link
                  key={curso.id}
                  href={`/cursos/${curso.slug}`}
                  className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-xl hover:scale-110 transition-transform"
                >
                  {curso.imagem && (
                    <Image
                      src={curso.imagem}
                      alt={curso.titulo}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
