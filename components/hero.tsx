import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle2, Play, ShieldCheck, Sparkles, Star } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-[800px] overflow-hidden bg-[#050712] pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="absolute inset-0 premium-grid opacity-50" />
      <div className="absolute -left-48 top-16 h-[560px] w-[560px] rounded-full bg-blue-600/20 blur-[140px]" />
      <div className="absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-violet-600/20 blur-[150px]" />
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-blue-200">
              <Sparkles size={13} /> Formação técnica para a bancada real
            </div>
            
            <h1 className="max-w-3xl text-5xl font-black leading-[.98] tracking-[-.055em] text-white sm:text-6xl lg:text-[74px]">
              Domine a bancada. <span className="premium-text">Eleve o seu nível.</span>
            </h1>
            
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
              Protocolos técnicos, diagnósticos precisos e procedimentos práticos para transformar conhecimento em confiança — e confiança em resultado.
            </p>
            
            {/* CTAs */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link 
                href="/cursos"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-4 text-sm font-bold text-white shadow-[0_12px_45px_rgba(37,99,235,.35)] transition hover:-translate-y-1"
              >
                Explorar formações <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/cursos/combo-iniciante-mobile"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                <Play size={16} fill="currentColor" /> Conhecer o método
              </Link>
            </div>

            {/* Linha de confiança */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-400">
              <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-cyan-400" /> Conteúdo direto ao ponto</span>
              <span className="flex items-center gap-2"><ShieldCheck size={15} className="text-cyan-400" /> Compra segura</span>
            </div>
          </div>
          
          {/* Right Visual - Tech Setup with Image */}
          <div className="relative mt-4 lg:mt-0">
            <div className="absolute -inset-5 rounded-[36px] bg-gradient-to-br from-blue-500/30 via-transparent to-violet-500/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[30px] border border-white/15 bg-white/5 p-2 shadow-2xl">
              <Image
                src="/hero-tech-pcb.jpg"
                alt="Ferramentas técnicas profissionais - PCB com sonda laser"
                width={1536}
                height={1024}
                className="aspect-[4/5] w-full rounded-[24px] object-cover lg:aspect-[4/5]"
                priority
              />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-[#070a15]/80 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div><p className="text-[10px] uppercase tracking-[.2em] text-cyan-300">Método G·Lab</p><p className="mt-1 font-bold text-white">Precisão em cada procedimento</p></div>
                  <div className="flex items-center gap-1 text-amber-300"><Star size={14} fill="currentColor" /><span className="text-xs font-bold">4.9</span></div>
                </div>
              </div>
            </div>
            <div className="absolute -left-6 top-10 hidden rounded-2xl border border-white/15 bg-[#0c1020]/90 px-5 py-4 shadow-xl backdrop-blur md:block">
              <p className="text-2xl font-black text-white">+10 anos</p><p className="text-[10px] uppercase tracking-widest text-slate-400">de experiência real</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
