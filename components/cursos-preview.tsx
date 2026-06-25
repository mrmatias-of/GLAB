import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default async function CursosPreview() {
  const supabase = await createClient()
  const { data: cursos } = await supabase
    .from("cursos")
    .select("id, slug, titulo, descricao, preco, preco_original, imagem, destaque")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(5)

  if (!cursos?.length) return null

  const featured = cursos.find(c => c.destaque) || cursos[0]
  const rest = cursos.filter(c => c.id !== featured.id)

  return (
    <section className="px-6 py-16" style={{ backgroundColor: '#0B0B0C' }}>
      <div className="max-w-7xl mx-auto">

        {/* Cabeçalho da seção */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow mb-3">Nossos Cursos</p>
            <h2 className="section-title">Experimente</h2>
          </div>
          <Link
            href="/cursos"
            className="hidden md:inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase transition-colors"
            style={{ color: '#71717a' }}
          >
            Ver todos <ArrowRight size={13} />
          </Link>
        </div>

        {/* Grid destaque + lista */}
        <div className="grid lg:grid-cols-5 gap-4">

          {/* Card destaque grande */}
          <Link
            href={`/cursos/${featured.slug}`}
            className="lg:col-span-3 group relative rounded-2xl overflow-hidden block"
            style={{ minHeight: 420 }}
          >
            {featured.imagem ? (
              <Image
                src={featured.imagem}
                alt={featured.titulo}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            ) : (
              <div className="w-full h-full" style={{ background: '#18181b' }} />
            )}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }}
            />
            {featured.destaque && (
              <div className="absolute top-5 left-5">
                <span
                  className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded"
                  style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff' }}
                >
                  Mais Popular
                </span>
              </div>
            )}
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white font-extrabold text-2xl leading-tight mb-2 uppercase tracking-tight">
                {featured.titulo}
              </p>
              {featured.descricao && (
                <p className="text-sm mb-4 line-clamp-2" style={{ color: '#a1a1aa' }}>{featured.descricao}</p>
              )}
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold" style={{ color: '#818cf8' }}>{featured.preco}</span>
                {featured.preco_original && (
                  <span className="text-sm line-through" style={{ color: '#52525b' }}>{featured.preco_original}</span>
                )}
              </div>
            </div>
          </Link>

          {/* Cards menores */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {rest.map((curso) => (
              <Link
                key={curso.id}
                href={`/cursos/${curso.slug}`}
                className="group flex gap-4 items-center rounded-2xl p-4 transition-all duration-300 hover:scale-102 hover:-translate-y-1"
                style={{ 
                  backgroundColor: '#111113', 
                  border: '1px solid #27272a',
                }}
              >
                {/* Thumbnail */}
                <div className="relative rounded-xl overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-110 bg-zinc-900" style={{ width: 80, height: 80 }}>
                  {curso.imagem ? (
                    <Image
                      src={curso.imagem}
                      alt={curso.titulo}
                      fill
                      className="object-cover transition-brightness duration-300 group-hover:brightness-125"
                      sizes="80px"
                      loading="lazy"
                      placeholder="empty"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: '#18181b' }} />
                  )}
                </div>

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs sm:text-sm font-bold leading-snug line-clamp-3 mb-1 uppercase tracking-tight transition-colors group-hover:text-indigo-300"
                    style={{ color: '#fff' }}
                  >
                    {curso.titulo}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm sm:text-base font-extrabold transition-colors group-hover:text-indigo-400" style={{ color: '#818cf8' }}>{curso.preco}</span>
                    {curso.preco_original && (
                      <span className="text-xs line-through" style={{ color: '#52525b' }}>{curso.preco_original}</span>
                    )}
                  </div>
                </div>

                <ArrowRight size={15} className="flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-400" style={{ color: '#52525b' }} />
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
