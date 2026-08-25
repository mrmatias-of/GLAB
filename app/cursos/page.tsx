import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, BookOpen, Cpu, Layers3, Wrench, Smartphone, Laptop, Radio, Settings2 } from "lucide-react"
import { CATALOGO } from "@/lib/catalogo"

export const metadata: Metadata = { title: "Cursos de Assistência Técnica | G·LAB", description: "Formações práticas em reparo mobile, diagnóstico, gestão e performance." }

const trilhas = [
  { id: "fundamentos", titulo: "Fundamentos da bancada", texto: "Do primeiro atendimento aos reparos essenciais.", icon: Wrench },
  { id: "reparos", titulo: "Reparos e periféricos", texto: "Telas, baterias, conectores, sensores e recuperação.", icon: Smartphone },
  { id: "diagnostico", titulo: "Diagnóstico e placa", texto: "Medição, análise e falhas complexas.", icon: Cpu },
  { id: "microsolda", titulo: "Microsolda e componentes", texto: "Controle térmico, SMD, BGA e reconstrução de placa.", icon: Radio },
  { id: "apple", titulo: "Especialização Apple", texto: "Diagnóstico orientado a iPhone, logs e placas multicamadas.", icon: Smartphone },
  { id: "software", titulo: "Software e dados", texto: "Firmware oficial, recuperação e privacidade no atendimento.", icon: Settings2 },
  { id: "gestao", titulo: "Gestão profissional", texto: "Processos, precificação e qualidade.", icon: Layers3 },
  { id: "performance", titulo: "PC & Performance", texto: "Diagnóstico e otimização de computadores.", icon: Laptop },
] as const

export default function CursosPage() {
  return <main className="min-h-screen overflow-hidden bg-[#050712] text-white">
    <section className="relative border-b border-white/10 px-5 pb-20 pt-20 md:px-8 md:pb-28 md:pt-28">
      <div className="premium-grid absolute inset-0 opacity-50" /><div className="absolute left-1/3 top-0 h-80 w-80 rounded-full bg-blue-600/20 blur-[130px]" /><div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-[150px]" />
      <div className="relative mx-auto max-w-7xl"><span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.22em] text-cyan-300"><BookOpen size={14} /> Academia técnica G·LAB</span>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_.55fr] lg:items-end"><div><h1 className="max-w-4xl text-5xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl lg:text-8xl">Escolha sua próxima <span className="premium-text">especialidade.</span></h1><p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">Formações objetivas para transformar procedimentos de bancada em domínio técnico, confiança e resultado.</p></div>
          <div className="grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/10 bg-white/5 p-5"><strong className="text-3xl font-black text-cyan-300">{CATALOGO.length}</strong><p className="mt-1 text-xs text-slate-400">formações técnicas</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-5"><strong className="text-3xl font-black text-violet-300">{trilhas.length}</strong><p className="mt-1 text-xs text-slate-400">trilhas de evolução</p></div></div>
        </div></div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">{trilhas.map((trilha, trilhaIndex) => { const produtos = CATALOGO.filter(c => c.trilha === trilha.id); const Icon = trilha.icon; return <div id={trilha.id} key={trilha.id} className={`${trilhaIndex ? "mt-24" : ""} scroll-mt-24`}>
      <div className="mb-9 flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-cyan-300"><Icon size={22} /></div><div><h2 className="text-2xl font-black md:text-3xl">{trilha.titulo}</h2><p className="mt-2 text-sm text-slate-400">{trilha.texto}</p></div></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{produtos.map(curso => <Link key={curso.id} href={`/cursos/${curso.slug}`} className="group overflow-hidden rounded-[26px] border border-white/10 bg-[#0a0d19] transition duration-500 hover:-translate-y-2 hover:border-cyan-400/35 hover:shadow-[0_24px_70px_rgba(0,174,255,.12)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#070914]"><Image src={curso.imagem} alt={curso.titulo} fill loading={Number(curso.id) <= 8 ? "eager" : "lazy"} className="object-cover object-center transition duration-700 group-hover:scale-105" sizes="(max-width:639px) calc(100vw - 40px), (max-width:1023px) 50vw, (max-width:1279px) 33vw, 25vw" /><div className="absolute inset-0 bg-gradient-to-t from-[#0a0d19] via-transparent to-transparent" /><span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.16em] backdrop-blur">{curso.nivel}</span>{curso.destaque && <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-3 py-1.5 text-[9px] font-black uppercase">Destaque</span>}</div>
        <div className="p-6"><div className="mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-cyan-400">{curso.id} — G·LAB</div><h3 className="text-xl font-black leading-tight group-hover:text-cyan-300">{curso.titulo}</h3><p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">{curso.descricao}</p><div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5"><span className="text-xs font-bold text-white/75">Ver formação</span><span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5"><ArrowUpRight size={16} /></span></div></div>
      </Link>)}</div></div> })}</section>
  </main>
}
