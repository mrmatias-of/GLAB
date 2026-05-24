import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Play, Headphones, Award, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function Hero() {
  const supabase = await createClient()
  const { data: cursos } = await supabase
    .from("cursos")
    .select("id, slug, titulo, imagem, preco, descricao")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(4)

  const topCursos = cursos?.slice(0, 4) ?? []

  return (
    <section className="relative px-6 pt-8 pb-16 overflow-hidden" style={{ backgroundColor: '#050510' }}>
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,212,200,0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-5 gap-6">
          
          {/* Hero Content - 2 cols */}
          <div className="lg:col-span-2 flex flex-col justify-center py-8">
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#00d4c8' }}>
              Do Basico ao Avancado
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Domine a<br />
              Assistencia<br />
              Tecnica<br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Avancada
              </span>
            </h1>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#71717a', maxWidth: '36ch' }}>
              Cursos praticos para tecnicos que querem diagnosticar, reparar e evoluir com metodo profissional.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              <Link 
                href="/cursos" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-black transition-all hover:brightness-110"
                style={{ backgroundColor: '#00d4c8' }}
              >
                Comecar Agora
                <ArrowRight size={16} />
              </Link>
              <Link 
                href="/cursos" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white border border-white/20 hover:bg-white/5 transition-all"
              >
                Ver Cursos
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-4 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <Play size={14} className="text-cyan-400" />
                <span>Aulas Praticas</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones size={14} className="text-cyan-400" />
                <span>Suporte Tecnico</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-cyan-400" />
                <span>Certificado</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-cyan-400" />
                <span>Comunidade</span>
              </div>
            </div>
          </div>

          {/* Course Cards Grid - 3 cols */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            {topCursos.map((curso, index) => (
              <Link
                key={curso.id}
                href={`/cursos/${curso.slug}`}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0a0a14] to-[#050510] hover:border-cyan-500/30 transition-all"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-zinc-900/50">
                  {curso.imagem ? (
                    <Image
                      src={curso.imagem}
                      alt={curso.titulo}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      priority={index < 2}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-600/20 to-blue-600/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent" />
                  
                  {/* Number badge */}
                  <div className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">0{index + 1}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-white leading-tight mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {curso.titulo}
                  </h3>
                  <p className="text-[10px] text-white/40 line-clamp-2 mb-3">
                    {curso.descricao}
                  </p>
                  
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                    <div className="w-4 h-4 rounded bg-gradient-to-r from-cyan-500 to-blue-500" />
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
