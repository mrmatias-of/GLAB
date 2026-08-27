import Link from 'next/link'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { notFound } from 'next/navigation'
import { CATALOGO, encontrarCurso } from '@/lib/catalogo'
import { productBySlug } from '@/lib/learning-platform'
import { CheckoutForm } from '@/components/checkout-form'

export const dynamicParams = false
export function generateStaticParams() { return CATALOGO.map(({ slug }) => ({ slug })) }

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const curso = encontrarCurso(slug)
  const produto = await productBySlug(slug)
  if (!curso || !produto) notFound()
  return <main className="relative isolate min-h-screen overflow-hidden bg-[#040610] px-5 py-10 text-white md:px-8"><div className="premium-grid absolute inset-0 opacity-40" /><div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/[.15] blur-[160px]" /><div className="absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full bg-violet-600/[.12] blur-[170px]" /><div className="relative mx-auto max-w-5xl"><Link href={`/cursos/${curso.slug}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-slate-400 hover:text-white"><ArrowLeft size={15} /> Voltar ao curso</Link><div className="mt-12 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><section className="pt-6"><span className="premium-kicker">Checkout seguro</span><h1 className="mt-4 text-4xl font-black tracking-[-.04em] md:text-5xl">Finalize sua formação.</h1><p className="mt-5 max-w-md leading-7 text-slate-300">Você está a um passo de liberar o acesso ao treinamento <strong className="text-white">{curso.titulo}</strong>.</p><div className="mt-8 flex items-center gap-3 text-sm text-slate-400"><LockKeyhole size={17} className="text-cyan-300" /> Seus dados são protegidos pelo PagBank.</div></section><section className="rounded-[30px] border border-white/[.12] bg-[#080b16]/90 p-6 shadow-[0_35px_100px_rgba(0,0,0,.5)] backdrop-blur-xl md:p-8"><div className="mb-7 flex items-start justify-between gap-4 border-b border-white/10 pb-6"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Você está adquirindo</p><h2 className="mt-2 text-xl font-black">{curso.titulo}</h2></div><p className="whitespace-nowrap text-lg font-black text-cyan-300">R$ {(produto.priceCents / 100).toFixed(2).replace('.', ',')}</p></div><CheckoutForm product={{ slug: produto.slug, title: produto.title, priceCents: produto.priceCents }} /></section></div></div></main>
}
