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
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
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
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-black transition-all hover:shadow-lg hover:shadow-cyan-500/50"
                style={{ background: 'linear-gradient(135deg, #00d4c8 0%, #7c3aed 100%)' }}
              >
                Comecar Agora
                <ArrowRight size={18} strokeWidth={3} />
              </Link>
              <Link 
                href="/cursos" 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white border-2 transition-all hover:bg-white/5"
                style={{ borderColor: '#a855f7' }}
              >
                Ver Cursos
                <ArrowRight size={18} strokeWidth={3} />
              </Link>
            </div>
            
            {/* Badges */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,200,0.1)', borderColor: '#00d4c8', borderWidth: '1px' }}>
                  <Zap size={16} style={{ color: '#00d4c8' }} />
                </div>
                <span className="font-semibold text-white leading-tight">Aulas Praticas<br />e Objetivas</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,200,0.1)', borderColor: '#00d4c8', borderWidth: '1px' }}>
                  <Headphones size={16} style={{ color: '#00d4c8' }} />
                </div>
                <span className="font-semibold text-white leading-tight">Suporte Tecnico<br />Especializado</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168, 85, 247, 0.1)', borderColor: '#a855f7', borderWidth: '1px' }}>
                  <Award size={16} style={{ color: '#a855f7' }} />
                </div>
                <span className="font-semibold text-white leading-tight">Certificado<br />Reconhecido</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,200,0.1)', borderColor: '#00d4c8', borderWidth: '1px' }}>
                  <Users size={16} style={{ color: '#00d4c8' }} />
                </div>
                <span className="font-semibold text-white leading-tight">Comunidade<br />Ativa</span>
              </div>
            </div>
          </div>
          
          {/* Right Visual - Tech Setup with Image */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-cyan-500/30">
              {/* Background gradient */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, rgba(0,212,200,0.1) 0%, rgba(123, 58, 237, 0.05) 100%)'
              }} />
              
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-20" style={{ 
                backgroundImage: 'linear-gradient(rgba(0,212,200,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,200,.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
              
              {/* Circuit board effect */}
              <div className="absolute inset-0 opacity-30" style={{
                background: 'radial-gradient(circle at 20% 50%, rgba(0,212,200,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(123, 58, 237, 0.1) 0%, transparent 50%)'
              }} />
              
              {/* Hero Image */}
              <div className="absolute inset-0">
                <Image
                  src="/hero-tech-pcb.jpg"
                  alt="Ferramentas técnicas profissionais - PCB com sonda laser"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-transparent to-violet-950/40" />
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-lg border border-cyan-500/30 opacity-60 animate-pulse" />
              <div className="absolute top-1/3 right-1/3 w-16 h-16 rounded border border-violet-500/30 opacity-40 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-lg border border-cyan-500/20 opacity-50 animate-pulse" style={{ animationDelay: '0.6s' }} />
              
              {/* Center light effect */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full" style={{
                background: 'radial-gradient(circle, rgba(0,212,200,0.2) 0%, transparent 70%)',
                filter: 'blur(40px)'
              }} />
              
              {/* Neon accent lines */}
              <div className="absolute top-0 left-1/3 w-px h-full opacity-20" style={{ background: 'linear-gradient(to bottom, rgba(0,212,200,0.5), transparent)' }} />
              <div className="absolute top-1/2 left-0 w-full h-px opacity-20" style={{ background: 'linear-gradient(to right, rgba(0,212,200,0.5), transparent)' }} />
              
              {/* Text labels */}
              <div className="absolute top-8 right-8 text-xs font-bold text-cyan-400 opacity-60">CPU</div>
              <div className="absolute bottom-8 left-8 text-xs font-bold text-cyan-400 opacity-40">3.80v</div>
            </div>
            
            {/* Floating side panel */}
            <div className="absolute -right-20 top-20 w-40 p-3 rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-black/60 backdrop-blur-sm">
              <div className="text-[10px] font-mono text-cyan-400 space-y-1">
                <div>▸ SYS_SCAN.exe</div>
                <div>▸ DIAG_TOOL v2.1</div>
                <div>▸ CPU_TEMP 45°C</div>
                <div className="text-amber-500">⚠ PWR_CHK</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom neon border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-30" />
    </section>
  )
}
