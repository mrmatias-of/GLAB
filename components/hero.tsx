import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Zap, Headphones, Award, Users } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: '#050510', minHeight: '600px' }}>
      {/* Neon border top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
      
      {/* Neon border left */}
      <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-30" />
      
      {/* Neon border right */}
      <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-violet-500 to-transparent opacity-30" />
      
      {/* Grid background */}
      <div className="absolute inset-0 opacity-5" style={{ 
        backgroundImage: 'linear-gradient(rgba(0,212,200,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,200,.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: '#00d4c8' }}>
              Do Basico ao Avancado
            </p>
            
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 text-white">
              Domine a<br />
              Assistencia<br />
              Tecnica<br />
              <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Avancada
              </span>
            </h1>
            
            <p className="text-base leading-relaxed mb-8 max-w-sm" style={{ color: '#a1a1aa' }}>
              Cursos praticos para tecnicos que querem diagnosticar, reparar e evoluir com metodo profissional.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link 
                href="/cursos" 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-black transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #00d4c8 0%, #7c3aed 100%)' }}
              >
                Comecar Agora
                <ArrowRight size={18} strokeWidth={3} />
              </Link>
              <Link 
                href="/cursos" 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white border-2 transition-all duration-300 hover:bg-white/5 hover:scale-110"
                style={{ borderColor: '#a855f7' }}
              >
                Ver Cursos
                <ArrowRight size={18} strokeWidth={3} />
              </Link>
            </div>
            
            {/* Badges */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 transition-all duration-300 hover:scale-110 hover:border-cyan-500/50 hover:bg-cyan-500/10 cursor-pointer">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300" style={{ background: 'rgba(0,212,200,0.1)', borderColor: '#00d4c8', borderWidth: '1px' }}>
                  <Zap size={16} style={{ color: '#00d4c8' }} />
                </div>
                <span className="font-semibold text-white leading-tight">Aulas Praticas<br />e Objetivas</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 transition-all duration-300 hover:scale-110 hover:border-cyan-500/50 hover:bg-cyan-500/10 cursor-pointer">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300" style={{ background: 'rgba(0,212,200,0.1)', borderColor: '#00d4c8', borderWidth: '1px' }}>
                  <Headphones size={16} style={{ color: '#00d4c8' }} />
                </div>
                <span className="font-semibold text-white leading-tight">Suporte Tecnico<br />Especializado</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 transition-all duration-300 hover:scale-110 hover:border-violet-500/50 hover:bg-violet-500/10 cursor-pointer">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300" style={{ background: 'rgba(168, 85, 247, 0.1)', borderColor: '#a855f7', borderWidth: '1px' }}>
                  <Award size={16} style={{ color: '#a855f7' }} />
                </div>
                <span className="font-semibold text-white leading-tight">Certificado<br />Reconhecido</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 transition-all duration-300 hover:scale-110 hover:border-cyan-500/50 hover:bg-cyan-500/10 cursor-pointer">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300" style={{ background: 'rgba(0,212,200,0.1)', borderColor: '#00d4c8', borderWidth: '1px' }}>
                  <Users size={16} style={{ color: '#00d4c8' }} />
                </div>
                <span className="font-semibold text-white leading-tight">Comunidade<br />Ativa</span>
              </div>
            </div>
          </div>
          
          {/* Right Visual - Tech Setup with Image */}
          <div className="relative hidden lg:flex items-center justify-center h-[600px]">
            <div className="relative w-full h-full rounded-2xl border-2 border-cyan-500/30 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,212,200,0.05) 0%, rgba(123,58,237,0.05) 100%)' }}>
              <Image
                src="/hero-tech-pcb.jpg"
                alt="Ferramentas técnicas profissionais - PCB com sonda laser"
                width={1536}
                height={1024}
                className="w-full h-full object-contain"
                priority
              />
              {/* Overlay sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-transparent to-violet-950/30 pointer-events-none" />
              {/* Neon accent lines */}
              <div className="absolute top-0 left-1/3 w-px h-full opacity-10" style={{ background: 'linear-gradient(to bottom, rgba(0,212,200,0.5), transparent)' }} />
              <div className="absolute top-1/2 left-0 w-full h-px opacity-10" style={{ background: 'linear-gradient(to right, rgba(0,212,200,0.5), transparent)' }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom neon border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-30" />
    </section>
  )
}
