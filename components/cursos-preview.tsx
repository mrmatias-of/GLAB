import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

export default async function CursosPreview() {
  const supabase = await createClient()
  const { data: cursos } = await supabase
    .from("cursos")
    .select("id, slug, titulo, preco, preco_original, imagem, destaque")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(5)

  if (!cursos?.length) return null

  const featured = cursos.find(c => c.destaque) || cursos[0]
  const rest = cursos.filter(c => c.id !== featured.id)

  return (
    <section className="py-16 px-5">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12">Cursos em Destaque</h2>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Card destaque grande */}
          <Link href={`/cursos/${featured.slug}`} className="lg:col-span-3 group">
            <div className="relative h-96 lg:h-full rounded-2xl overflow-hidden bg-gray-900 min-h-96">
              {featured.imagem && (
                <Image
                  src={featured.imagem}
                  alt={featured.titulo}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-2">{featured.titulo}</h3>
                <p className="text-2xl font-bold text-purple-400">{featured.preco}</p>
              </div>
            </div>
          </Link>

          {/* Cards menores */}
          <div className="lg:col-span-2 space-y-4">
            {rest.map((curso) => (
              <Link key={curso.id} href={`/cursos/${curso.slug}`} className="block group">
                <div className="relative h-24 rounded-2xl overflow-hidden bg-gray-900">
                  {curso.imagem && (
                    <Image
                      src={curso.imagem}
                      alt={curso.titulo}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    <p className="text-sm font-semibold text-white line-clamp-2">{curso.titulo}</p>
                    <p className="text-purple-400 font-bold">{curso.preco}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
