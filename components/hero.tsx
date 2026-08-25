import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpenCheck, Check, ChevronRight, CircuitBoard, ShieldCheck, Sparkles } from "lucide-react"

const process = ["Sintoma", "Medição", "Diagnóstico", "Validação"]

export default function Hero() {
  return (
    <section className="relative isolate min-h-[860px] overflow-hidden border-b border-white/[.08] bg-[#040610]">
      <div className="premium-grid absolute inset-0 opacity-50" />
      <div className="absolute -left-48 top-24 h-[620px] w-[620px] rounded-full bg-blue-600/[.16] blur-[170px]" />
      <div className="absolute -right-36 top-10 h-[700px] w-[700px] rounded-full bg-violet-600/[.15] blur-[190px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

      <div className="relative mx-auto grid min-h-[780px] max-w-[1440px] items-center gap-14 px-5 pb-20 pt-16 md:px-8 md:pb-24 md:pt-20 lg:grid-cols-[.88fr_1.12fr] lg:gap-10 xl:px-12">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[.08] px-4 py-2 text-[9px] font-black uppercase tracking-[.24em] text-cyan-200">
              <Sparkles size={12} /> Formação técnica profissional
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[.18em] text-white/35">Por Guilherme Julião</span>
          </div>

          <h1 className="text-[clamp(3.6rem,7vw,7.2rem)] font-black leading-[.84] tracking-[-.07em] text-white">
            Pare de<br />trocar peças.<br /><span className="premium-text">Domine o diagnóstico.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-7 text-slate-300 md:text-lg md:leading-8">
            Formação prática para técnicos que querem sair do improviso, construir raciocínio de bancada e executar reparos com padrão profissional.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/cursos" className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-black text-[#071020] shadow-[0_18px_50px_rgba(255,255,255,.12)] transition hover:-translate-y-1 hover:bg-cyan-100">
              Explorar as 48 formações <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
            <Link href="#metodo" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[.05] px-7 py-4 text-sm font-bold text-white backdrop-blur transition hover:border-cyan-300/30 hover:bg-white/[.09]">
              Conhecer o método <ChevronRight size={17} />
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-2"><BookOpenCheck size={15} className="text-cyan-300" /> Currículo por trilhas</span>
            <span className="flex items-center gap-2"><ShieldCheck size={15} className="text-cyan-300" /> Autoria identificada</span>
            <span className="flex items-center gap-2"><Check size={15} className="text-cyan-300" /> Aplicação imediata</span>
          </div>
        </div>

        <div className="relative lg:translate-x-8 xl:translate-x-12">
          <div className="absolute -inset-10 rounded-[56px] bg-gradient-to-br from-cyan-400/20 via-blue-600/5 to-violet-500/20 blur-[45px]" />
          <div className="relative overflow-hidden rounded-[34px] border border-white/[.14] bg-[#080b16]/85 p-2.5 shadow-[0_45px_120px_rgba(0,0,0,.65)] backdrop-blur-xl">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[27px] bg-[#050712]">
              <Image src="/images/hero-microscope-lab-v2.png" alt="Bancada profissional de diagnóstico eletrônico com microscópio" fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03050c]/95 via-transparent to-[#03050c]/10" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="flex items-end justify-between gap-6">
                  <div><p className="text-[9px] font-black uppercase tracking-[.25em] text-cyan-300">Protocolo G·LAB</p><p className="mt-2 max-w-md text-xl font-black leading-tight text-white md:text-2xl">Precisão antes da intervenção.</p></div>
                  <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-cyan-200 sm:flex"><CircuitBoard size={21} /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative -mt-5 mx-4 rounded-2xl border border-white/10 bg-[#0a0d19]/95 p-3 shadow-2xl backdrop-blur-xl md:mx-10 md:p-4">
            <div className="grid grid-cols-4 gap-1.5">{process.map((item, index) => <div key={item} className="rounded-xl border border-white/[.07] bg-white/[.035] px-2 py-3 text-center"><span className="block text-[9px] font-black text-cyan-300">0{index + 1}</span><span className="mt-1 block text-[9px] font-bold text-white/65 md:text-[10px]">{item}</span></div>)}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
