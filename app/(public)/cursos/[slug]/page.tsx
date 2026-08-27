import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react"
import { CATALOGO, encontrarCurso } from "@/lib/catalogo"
import { productBySlug } from "@/lib/learning-platform"
import { brl, discountPercent } from "@/lib/format"

export const dynamicParams = false
export function generateStaticParams() { return CATALOGO.map(({ slug }) => ({ slug })) }

export default async function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const curso = encontrarCurso((await params).slug); if (!curso) notFound()
  const produto = await productBySlug(curso.slug)
  const off = produto ? discountPercent(produto.compareAtCents, produto.priceCents) : null
  return <main className="min-h-screen overflow-hidden bg-[#050712] text-white">
    <section className="relative px-5 py-16 md:px-8 md:py-24"><div className="premium-grid absolute inset-0 opacity-40" /><div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[150px]" />
      <div className="relative mx-auto max-w-7xl"><Link href="/cursos" className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-slate-400 hover:text-white"><ArrowLeft size={15} /> Voltar ao catálogo</Link>
        <div className="grid gap-14 lg:grid-cols-[1fr_.9fr] lg:items-center"><div><span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-cyan-300"><Sparkles size={13} /> Formação G·LAB · {curso.nivel}</span><h1 className="mt-7 text-5xl font-black leading-[.98] tracking-[-.05em] sm:text-6xl lg:text-7xl">{curso.titulo}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">{curso.descricao}</p><div className="mt-9 flex gap-6 text-xs text-slate-400"><span className="flex items-center gap-2"><BookOpen size={16} className="text-cyan-400" /> {curso.modulos.length} módulos</span><span className="flex items-center gap-2"><ShieldCheck size={16} className="text-cyan-400" /> Conteúdo prático</span></div></div>
          <div className="relative"><div className="absolute -inset-5 rounded-[38px] bg-gradient-to-br from-blue-500/25 to-violet-500/25 blur-2xl" /><div className="relative overflow-hidden rounded-[30px] border border-white/15 bg-white/5 p-2"><div className="relative aspect-video overflow-hidden rounded-[24px]"><Image src={curso.imagem} alt={curso.titulo} fill className="object-cover" priority sizes="(max-width:1024px) 100vw, 45vw" /><div className="absolute inset-0 bg-gradient-to-t from-[#050712]/60 to-transparent" /></div></div></div></div>
      </div></section>
    <section className="border-y border-white/10 bg-white/[.025] px-5 py-20 md:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.65fr]"><div><span className="text-xs font-black uppercase tracking-[.2em] text-cyan-400">O que você vai dominar</span><h2 className="mt-4 text-3xl font-black md:text-5xl">Conteúdo para a bancada real.</h2><div className="mt-10 grid gap-4 sm:grid-cols-2">{curso.modulos.map((m, i) => <div key={m} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0a0d19] p-5"><span className="text-xs font-black text-cyan-400">{String(i + 1).padStart(2,"0")}</span><CheckCircle2 size={18} className="text-cyan-400" /><strong className="text-sm">{m}</strong></div>)}</div></div>
      <aside className="h-fit rounded-[28px] border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-violet-500/10 p-8"><span className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">Acesso imediato</span><h3 className="mt-4 text-2xl font-black">Comece sua formação</h3>{produto ? <div className="mt-6"><div className="flex items-end gap-3">{produto.compareAtCents && off ? <span className="pb-1 text-base font-semibold text-slate-500 line-through">{brl(produto.compareAtCents)}</span> : null}<span className="text-4xl font-black tracking-tight text-white">{brl(produto.priceCents)}</span></div><div className="mt-3 flex items-center gap-3">{off ? <span className="rounded-full bg-cyan-400/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[.12em] text-cyan-300">{off}% OFF</span> : null}<span className="text-xs text-slate-400">pagamento único</span></div></div> : null}<p className="mt-5 text-sm leading-6 text-slate-300">Finalize sua inscrição com cartão ou Pix pelo checkout seguro do PagBank.</p><Link href={`/checkout/${curso.slug}`} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 text-sm font-black">Comprar agora <ArrowRight size={17} /></Link></aside></div></section>
  </main>
}
