import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, Clock3, ShieldCheck, Sparkles, Target, Users, Wrench } from "lucide-react"
import { CATALOGO, encontrarCurso } from "@/lib/catalogo"

export const dynamicParams = false
export function generateStaticParams(){return CATALOGO.map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const curso=encontrarCurso((await params).slug)
  return curso?{title:`${curso.titulo} | G·LAB`,description:curso.descricao,openGraph:{title:curso.titulo,description:curso.descricao,images:[curso.imagem]}}:{}
}

const detalhes=(modulo:string)=>[
  `Fundamentos e critérios de decisão em ${modulo.toLowerCase()}`,
  "Procedimento guiado com sequência de bancada",
  "Erros frequentes, prevenção de danos e pontos de controle",
  "Checklist de validação e registro do resultado",
]

export default async function CursoPage({params}:{params:Promise<{slug:string}>}){
  const curso=encontrarCurso((await params).slug);if(!curso)notFound()
  const relacionados=CATALOGO.filter(c=>c.trilha===curso.trilha&&c.slug!==curso.slug).slice(0,3)
  return <main className="min-h-screen overflow-hidden bg-[#050712] text-white">
    <section className="relative px-5 py-14 md:px-8 md:py-24"><div className="premium-grid absolute inset-0 opacity-40"/><div className="absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-[150px]"/>
      <div className="relative mx-auto max-w-7xl"><Link href="/cursos" className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-slate-400 hover:text-white"><ArrowLeft size={15}/>Catálogo completo</Link>
        <div className="grid gap-12 lg:grid-cols-[1fr_.9fr] lg:items-center"><div><span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-cyan-300"><Sparkles size={13}/>Formação {curso.id} · {curso.nivel}</span><h1 className="mt-7 text-5xl font-black leading-[.96] tracking-[-.055em] sm:text-6xl lg:text-7xl">{curso.titulo}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">{curso.descricao}</p>
          <div className="mt-8 flex flex-wrap gap-3">{[[BookOpen,`${curso.modulos.length} módulos`],[Clock3,`${curso.cargaHoraria} de conteúdo`],[ShieldCheck,"Método de bancada"]].map(([Icon,label])=><span key={String(label)} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300"><Icon size={15} className="text-cyan-400"/>{String(label)}</span>)}</div>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href={`/contato?curso=${curso.slug}`} className="inline-flex items-center gap-3 rounded-full bg-cyan-300 px-7 py-4 text-sm font-black text-[#071020] transition hover:-translate-y-1 hover:bg-cyan-200">Comprar agora <ArrowRight size={17}/></Link>
            <Link href="#conteudo" className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[.06] px-7 py-4 text-sm font-black text-white transition hover:border-cyan-300/40 hover:bg-white/10">Ver currículo <BookOpen size={16}/></Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">Pagamento e liberação do acesso são confirmados pela equipe G·LAB.</p></div>
          <div className="relative"><div className="absolute -inset-5 rounded-[38px] bg-gradient-to-br from-blue-500/25 to-violet-500/25 blur-2xl"/><div className="relative overflow-hidden rounded-[30px] border border-white/15 bg-white/5 p-2"><div className="relative aspect-[16/10] overflow-hidden rounded-[24px]"><Image src={curso.imagem} alt={`Bancada técnica relacionada ao curso ${curso.titulo}`} fill className="object-cover object-center" priority sizes="(max-width:1023px) calc(100vw - 40px), 45vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#050712]/70 via-transparent to-transparent"/><div className="absolute bottom-5 left-5 right-5 flex items-end justify-between"><span className="text-xs font-black uppercase tracking-[.2em] text-white/75">G·LAB Academy</span><span className="rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-bold backdrop-blur">{curso.nivel}</span></div></div></div></div>
        </div></div></section>

    <section className="border-y border-white/10 bg-white/[.025] px-5 py-16 md:px-8 md:py-24"><div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">{[
      [Target,"Diagnóstico antes da ação","Aprenda a confirmar a causa da falha e escolher o procedimento com evidências."],
      [Wrench,"Execução reproduzível","Siga sequências, pontos de controle e critérios claros para reduzir retrabalho."],
      [CheckCircle2,"Validação profissional","Finalize com testes funcionais, documentação e orientação ao cliente."],
    ].map(([Icon,titulo,texto])=><article key={String(titulo)} className="rounded-[26px] border border-white/10 bg-[#0a0d19] p-7"><Icon size={24} className="text-cyan-300"/><h2 className="mt-5 text-xl font-black">{String(titulo)}</h2><p className="mt-3 text-sm leading-6 text-slate-400">{String(texto)}</p></article>)}</div></section>

    <section id="conteudo" className="px-5 py-20 md:px-8 md:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><span className="text-xs font-black uppercase tracking-[.2em] text-cyan-400">Currículo completo</span><h2 className="mt-4 text-4xl font-black tracking-[-.04em] md:text-6xl">Da teoria essencial à validação.</h2><p className="mt-5 text-slate-400">Cada módulo combina raciocínio técnico, execução guiada e critérios de qualidade aplicáveis à rotina real.</p></div>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">{curso.modulos.map((m,i)=><article key={m} className="rounded-[26px] border border-white/10 bg-[#0a0d19] p-6 md:p-8"><div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-xs font-black text-cyan-300">{String(i+1).padStart(2,"0")}</span><div><h3 className="text-xl font-black">{m}</h3><ul className="mt-5 space-y-3">{detalhes(m).map(item=><li key={item} className="flex gap-3 text-sm leading-6 text-slate-400"><Check size={16} className="mt-1 shrink-0 text-cyan-400"/>{item}</li>)}</ul></div></div></article>)}</div>
    </div></section>

    <section className="border-y border-white/10 bg-[#080b17] px-5 py-20 md:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2"><div><Users className="text-cyan-300"/><h2 className="mt-5 text-3xl font-black md:text-5xl">Para quem quer evoluir com método.</h2><p className="mt-5 max-w-xl leading-7 text-slate-400">Indicado para técnicos, auxiliares e profissionais em formação que desejam substituir tentativa e erro por processos verificáveis.</p></div><div className="grid gap-3 sm:grid-cols-2">{["Aulas organizadas por progressão","Checklists aplicáveis à bancada","Critérios de segurança e qualidade","Conteúdo consultável no dia a dia","Estudo no próprio ritmo","Atualizações da formação"].map(x=><div key={x} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm text-slate-300"><CheckCircle2 size={17} className="shrink-0 text-cyan-400"/>{x}</div>)}</div></div></section>

    <section className="px-5 py-20 md:px-8 md:py-28"><div className="mx-auto max-w-7xl rounded-[36px] border border-cyan-300/20 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,.18),transparent_35%),linear-gradient(135deg,#0b1733,#15133b)] p-8 md:p-14"><div className="grid gap-10 lg:grid-cols-[1fr_.55fr] lg:items-center"><div><span className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">Lista de interesse</span><h2 className="mt-4 text-4xl font-black tracking-[-.04em] md:text-6xl">Prepare sua próxima evolução técnica.</h2><p className="mt-5 max-w-2xl leading-7 text-blue-100/70">O checkout oficial está em preparação. Cadastre seu interesse para receber disponibilidade e condições de lançamento.</p></div><Link href={`/contato?curso=${curso.slug}`} className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-black text-blue-950 transition hover:-translate-y-1">Quero ser avisado <ArrowRight size={17}/></Link></div></div></section>

    {relacionados.length>0&&<section className="border-t border-white/10 px-5 py-20 md:px-8"><div className="mx-auto max-w-7xl"><h2 className="text-3xl font-black">Continue nesta trilha</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{relacionados.map(r=><Link key={r.slug} href={`/cursos/${r.slug}`} className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0a0d19] hover:border-cyan-400/30"><div className="relative aspect-[16/9]"><Image src={r.imagem} alt={r.titulo} fill className="object-cover" sizes="(max-width:767px) calc(100vw - 40px), 33vw"/></div><div className="p-6"><span className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-400">{r.nivel}</span><h3 className="mt-3 text-xl font-black group-hover:text-cyan-300">{r.titulo}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{r.descricao}</p></div></Link>)}</div></div></section>}
  </main>
}

