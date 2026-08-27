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
  return <main className="relative isolate min-h-screen overflow-hidden bg-[#040610] px-5 py-10 text-white md:px-8"><div className="premium-grid absolute inset-0 opacity-40" /><div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/[.15] blur-[160px]" /><div className="absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full bg-violet-600/[.12] blur-[170px]" /><div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl flex-col justify-center"><Link href={`/cursos/${curso.slug}`} className="mx-auto mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-slate-400 hover:text-cyan-300"><ArrowLeft size={15} /> Voltar ao curso</Link><section className="rounded-[30px] border border-white/[.14] bg-[#080b16]/95 p-6 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-xl md:p-9"><div className="mb-8 border-b border-white/10 pb-7"><p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">Checkout seguro G-LAB</p><div className="mt-4 flex items-start justify-between gap-5"><div><h1 className="text-2xl font-black tracking-tight md:text-3xl">Finalize sua inscrição</h1><p className="mt-2 text-sm leading-6 text-slate-400">Acesso ao curso <strong className="text-slate-200">{curso.titulo}</strong></p></div><p className="whitespace-nowrap text-xl font-black text-cyan-300">R$ {(produto.priceCents / 100).toFixed(2).replace('.', ',')}</p></div></div><CheckoutForm product={{ slug: produto.slug, title: produto.title, priceCents: produto.priceCents }} /><div className="mt-7 flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-xs text-slate-500"><LockKeyhole className="text-cyan-300" /> Pagamento protegido pelo PagBank</div></section></div></main>
}
