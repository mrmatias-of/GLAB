import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

export default async function Hero() {
  const supabase = await createClient()
  const { data: cursos } = await supabase
    .from("cursos")
    .select("id, slug, titulo, imagem, preco")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(1)

  const featured = cursos?.[0]

  return (
    <section className="pt-16 pb-12 px-5">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-4">DOMINE A ASSISTÊNCIA TÉCNICA</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Métodos que funcionam de verdade
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Guias técnicos criados por quem já reparou mais de 20.000 aparelhos
          </p>
          <Link href="/cursos" className="inline-block px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
            Explorar Cursos
          </Link>
        </div>

        {featured && (
          <div className="relative h-96 rounded-2xl overflow-hidden">
            {featured.imagem && (
              <Image
                src={featured.imagem}
                alt={featured.titulo}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-600/60 via-purple-600/40 to-blue-600/60" />
          </div>
        )}
      </div>
    </section>
  )
}
