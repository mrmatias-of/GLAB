import Image from "next/image"
import { Tag, BookOpen, Clock, Zap } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"
import BackButton from "@/components/back-button"

export default function CursoHero({ curso }: { curso: Curso }) {
  const Icon = curso.icon
  const totalTopicos = curso.modulos.reduce((acc, m) => acc + m.topicos.length, 0)

  return (
    <section className="relative min-h-[80vh] flex items-center pt-24 pb-16 bg-white">

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Back button */}
        <BackButton />

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left - Content */}
          <div>
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 mb-6">
              <Icon size={14} className="text-blue-600" />
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">{curso.tag}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-4">
              {curso.titulo}
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl mb-8">
              {curso.subtitulo || curso.descricao}
            </p>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                <BookOpen size={16} className="text-blue-600" />
                <span className="text-sm font-bold text-gray-900">{curso.modulos.length}</span>
                <span className="text-sm text-gray-600">módulos</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                <Zap size={16} className="text-blue-600" />
                <span className="text-sm font-bold text-gray-900">{totalTopicos}</span>
                <span className="text-sm text-gray-600">tópicos</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                <Clock size={16} className="text-blue-600" />
                <span className="text-sm text-gray-600">Acesso imediato</span>
              </div>
            </div>

            {/* Price card mobile */}
            <div className="lg:hidden">
              <PriceCard curso={curso} />
            </div>
          </div>

          {/* Right - Image + Price */}
          <div className="space-y-6">
            {/* Course Image */}
            {curso.imagem && (
              <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                <Image
                  src={curso.imagem}
                  alt={curso.titulo}
                  width={800}
                  height={450}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            )}

            {/* Price card desktop */}
            <div className="hidden lg:block">
              <PriceCard curso={curso} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PriceCard({ curso }: { curso: Curso }) {
  return (
    <div className="rounded-xl border border-gray-200 p-6 bg-gray-50">
      <div>
        <div className="flex items-baseline gap-3 mb-1">
          {curso.precoOriginal && (
            <span className="text-lg text-gray-400 line-through">{curso.precoOriginal}</span>
          )}
          <span className="text-4xl md:text-5xl font-black text-blue-600">{curso.preco}</span>
        </div>
        <p className="text-xs text-gray-600 mb-6">pagamento único</p>

        <a
          href={curso.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg font-black text-base px-6 py-4 transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700"
        >
          {curso.cta}
        </a>

        <p className="text-[11px] text-gray-600 text-center mt-4 flex items-center justify-center gap-2">
          <Tag size={12} />
          Pagamento único via Kirvano
        </p>
      </div>
    </div>
  )
}
