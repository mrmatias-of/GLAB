import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function Hero() {
  const supabase = await createClient()
  const { data: cursos } = await supabase
    .from("cursos")
    .select("id, slug, titulo, imagem, preco, descricao")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(4)

  const featured = cursos?.[0]
  const thumbnails = cursos?.slice(1, 4) ?? []

  return (
    <section className="px-6 pt-14 pb-16" style={{ backgroundColor: '#0B0B0C' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Texto ── */}
          <div>
            <p className="eyebrow mb-5">Manutenção de Celulares &amp; Troca de Vidro</p>
            <h1 className="section-title mb-6">
              Domine a<br />
              Assistência<br />
              Técnica
            </h1>
            <p className="text-base leading-relaxed mb-10" style={{ color: '#71717a', maxWidth: '36ch' }}>
              Guias técnicos criados por quem já reparou mais de 20.000 aparelhos.
              Métodos testados na prática, direto ao ponto.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/cursos" className="btn-primary">
                Explorar Cursos
                <ArrowRight size={15} />
              </Link>
              <Link href="/contato" className="btn-outline">
                Falar Conosco
              </Link>
            </div>
          </div>

          {/* ── Imagem destaque + thumbnails ── */}
          <div className="flex gap-3">
            {/* Card principal */}
            <div className="flex-1 relative rounded-2xl overflow-hidden" style={{ minHeight: 380 }}>
              {featured?.imagem ? (
                <Image
                  src={featured.imagem}
                  alt={featured.titulo}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#1e1b4b,#111113)' }} />
              )}
              {/* overlay degradê sutil na base */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white font-bold text-lg leading-snug">{featured?.titulo}</p>
                <p className="mt-1 font-extrabold" style={{ color: '#818cf8' }}>{featured?.preco}</p>
              </div>
            </div>

            {/* Coluna de thumbnails */}
            {thumbnails.length > 0 && (
              <div className="flex flex-col gap-3 w-28">
                {thumbnails.map((c) => (
                  <Link key={c.id} href={`/cursos/${c.slug}`} className="relative rounded-xl overflow-hidden flex-1 block" style={{ minHeight: 100 }}>
                    {c.imagem ? (
                      <Image src={c.imagem} alt={c.titulo} fill className="object-cover" sizes="112px" />
                    ) : (
                      <div className="w-full h-full" style={{ background: '#18181b' }} />
                    )}
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
