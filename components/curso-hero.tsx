import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Tag, BookOpen, Clock, Zap } from "lucide-react"
import type { Curso } from "@/lib/cursos-data"

export default function CursoHero({ curso }: { curso: Curso }) {
  const Icon = curso.icon
  const totalTopicos = curso.modulos.reduce((acc, m) => acc + m.topicos.length, 0)

  return (
    <section className="relative min-h-[80vh] flex items-center pt-24 pb-16" style={{ backgroundColor: '#050510' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(0,212,200,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,200,.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        {/* Radial glow */}
        <div className="absolute top-20 right-1/4 w-[600px] h-[400px] rounded-full opacity-30" style={{
          background: 'radial-gradient(circle, rgba(0,212,200,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] rounded-full opacity-20" style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }} />
        {/* Neon lines */}
        <div className="absolute top-0 left-0 w-1 h-full" style={{ background: 'linear-gradient(to bottom, rgba(0,212,200,0.3), transparent 50%)' }} />
        <div className="absolute top-0 right-0 w-1 h-full" style={{ background: 'linear-gradient(to bottom, rgba(139,92,246,0.3), transparent 50%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Back button */}
        <Link
          href="javascript:history.back()"
          className="inline-flex items-center gap-2 text-white/50 hover:text-cyan-400 transition-colors text-sm mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left - Content */}
          <div>
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 mb-6">
              <Icon size={14} className="text-cyan-400" />
              <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">{curso.tag}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              {curso.titulo}
            </h1>
            
            <p className="text-lg text-white/60 leading-relaxed max-w-xl mb-8">
              {curso.subtitulo || curso.descricao}
            </p>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                <BookOpen size={16} className="text-cyan-400" />
                <span className="text-sm font-bold text-white">{curso.modulos.length}</span>
                <span className="text-sm text-white/50">modulos</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                <Zap size={16} className="text-cyan-400" />
                <span className="text-sm font-bold text-white">{totalTopicos}</span>
                <span className="text-sm text-white/50">topicos</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                <Clock size={16} className="text-cyan-400" />
                <span className="text-sm text-white/50">Acesso vitalicio</span>
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
              <div className="relative rounded-2xl border-2 border-cyan-500/20 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,212,200,0.05) 0%, rgba(139,92,246,0.05) 100%)' }}>
                <Image
                  src={curso.imagem}
                  alt={curso.titulo}
                  width={800}
                  height={450}
                  className="w-full h-auto object-contain"
                  priority
                />
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/50 via-transparent to-transparent pointer-events-none" />
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
    <div className="rounded-2xl border-2 border-cyan-500/30 p-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(0,212,200,0.08) 0%, rgba(5,5,16,0.95) 100%)' }}>
      {/* Glow effect */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,212,200,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      
      <div className="relative">
        <div className="flex items-baseline gap-3 mb-1">
          {curso.precoOriginal && (
            <span className="text-lg text-white/30 line-through">{curso.precoOriginal}</span>
          )}
          <span className="text-4xl md:text-5xl font-black text-cyan-400" style={{ textShadow: '0 0 30px rgba(0,212,200,0.5)' }}>{curso.preco}</span>
        </div>
        <p className="text-xs text-white/40 mb-6">pagamento unico</p>

        <a
          href={curso.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-black text-base px-6 py-4 transition-all duration-300"
          style={{ 
            background: 'linear-gradient(135deg, #00d4c8 0%, #06b6d4 100%)',
            color: '#050510',
            boxShadow: '0 0 30px rgba(0,212,200,0.4)'
          }}
        >
          {curso.cta}
        </a>

        <p className="text-[11px] text-white/40 text-center mt-4 flex items-center justify-center gap-2">
          <Tag size={12} />
          Pagamento unico - Acesso vitalicio
        </p>
      </div>
    </div>
  )
}
