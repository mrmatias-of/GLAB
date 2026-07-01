import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Zap, Headphones, Award, Users } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24">
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start lg:items-center">
          
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold flex lg:inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-2 rounded-full border border-blue-600" style={{ background: '#1e3a8a', color: '#60a5fa' }}>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              ASSISTÊNCIA TÉCNICA MOBILE
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 text-white text-center lg:text-left">
              Aprenda reparos em celulares com mais{" "}
              <span style={{ color: '#2563eb' }}>
                segurança e método
              </span>{" "}
              na bancada
            </h1>
            
            <p className="text-base leading-relaxed mb-8 max-w-lg text-slate-300 text-center lg:text-left mx-auto lg:mx-0">
              Guias técnicos práticos para troca de tela, bateria, conectores, software e diagnóstico, desenvolvidos para quem quer começar ou evoluir na assistência técnica.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center lg:justify-start">
              <Link 
                href="/cursos"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-sm text-white transition-all duration-300 hover:shadow-md w-full sm:w-auto"
                style={{ backgroundColor: '#2563eb' }}
              >
                Ver Guias Técnicos
                <ArrowRight size={18} strokeWidth={3} />
              </Link>
              <Link 
                href="/cursos/combo-iniciante-mobile"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-sm border-2 transition-all duration-300 w-full sm:w-auto"
                style={{ color: '#60a5fa', borderColor: '#60a5fa', backgroundColor: 'transparent' }}
              >
                Começar pelo Combo Iniciante — R$ 17,90
                <ArrowRight size={18} strokeWidth={3} />
              </Link>
            </div>

            {/* Linha de confiança */}
            <p className="text-[11px] text-slate-500 mb-10 text-center lg:text-left">
              Conteúdo prático • Compra segura via Kirvano • Acesso pela Kirvano
            </p>
            
            {/* Badges - Cards de Valor */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col items-center lg:items-start p-4 rounded-lg border border-slate-700 bg-slate-800 transition-all duration-300 hover:bg-slate-700 text-center lg:text-left">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-blue-100">
                  <Zap size={16} className="text-blue-600" />
                </div>
                <span className="font-black text-white text-lg">Guias técnicos</span>
                <span className="text-xs text-slate-400 leading-tight">Para assistência mobile</span>
              </div>
              
              <div className="flex flex-col items-center lg:items-start p-4 rounded-lg border border-slate-700 bg-slate-800 transition-all duration-300 hover:bg-slate-700 text-center lg:text-left">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-green-100">
                  <Users size={16} className="text-green-600" />
                </div>
                <span className="font-black text-white text-lg">Comunidade GJ</span>
                <span className="text-xs text-slate-400 leading-tight">Aprenda com quem pratica</span>
              </div>
              
              <div className="flex flex-col items-center lg:items-start p-4 rounded-lg border border-slate-700 bg-slate-800 transition-all duration-300 hover:bg-slate-700 text-center lg:text-left">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-orange-100">
                  <Award size={16} className="text-orange-600" />
                </div>
                <span className="font-black text-white text-lg">Conteúdo prático</span>
                <span className="text-xs text-slate-400 leading-tight">Para aplicar na bancada</span>
              </div>
              
              <div className="flex flex-col items-center lg:items-start p-4 rounded-lg border border-slate-700 bg-slate-800 transition-all duration-300 hover:bg-slate-700 text-center lg:text-left">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-purple-100">
                  <Headphones size={16} className="text-purple-600" />
                </div>
                <span className="font-black text-white text-lg">Do básico ao avançado</span>
                <span className="text-xs text-slate-400 leading-tight">Evolua por etapas</span>
              </div>
            </div>
          </div>
          
          {/* Right Visual - Tech Setup with Image - Hidden for now */}
          <div className="hidden">
            <div className="relative w-full max-w-sm rounded-xl overflow-hidden" style={{ maxHeight: '200px' }}>
              <Image
                src="/hero-tech-pcb.jpg"
                alt="Ferramentas técnicas profissionais - PCB com sonda laser"
                width={300}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
