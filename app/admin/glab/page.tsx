import Link from 'next/link'
import { BookOpen, CreditCard, GraduationCap, ShieldCheck } from 'lucide-react'
import { currentPlatformUser, isPlatformAdmin, platformAdminSummary } from '@/lib/learning-platform'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function GlabAdminPage() {
  const user = await currentPlatformUser()
  if (!user) redirect('/sign-in')
  if (!isPlatformAdmin(user.email)) return <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-8 text-amber-100"><ShieldCheck className="mb-4 text-amber-300" /><h1 className="text-2xl font-black">Acesso administrativo pendente</h1><p className="mt-3 max-w-xl text-sm leading-6 text-amber-100/75">Para proteger a operação, o e-mail desta conta precisa constar na variável segura <code>GLAB_ADMIN_EMAILS</code> da Vercel. Nenhum painel administrativo é aberto apenas por aparência ou cookie.</p></div>
  const data = await platformAdminSummary()
  const cards = [{ label: 'Produtos cadastrados', value: data.products, icon: BookOpen, color: 'text-cyan-300' }, { label: 'Formações ativas', value: data.activeProducts, icon: CreditCard, color: 'text-emerald-300' }, { label: 'Alunos com acesso', value: data.students, icon: GraduationCap, color: 'text-violet-300' }, { label: 'Pedidos pagos', value: data.paidOrders, icon: ShieldCheck, color: 'text-blue-300' }]
  return <div className="space-y-8"><div><p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">G-LAB Learning OS</p><h1 className="mt-2 text-3xl font-black text-white">Operação da plataforma</h1><p className="mt-2 text-sm text-slate-400">Controle cursos, disponibilidade, pagamentos confirmados e acessos de alunos.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => { const Icon = card.icon; return <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-5"><Icon className={card.color} size={21} /><p className="mt-5 text-3xl font-black text-white">{card.value}</p><p className="mt-1 text-xs text-slate-400">{card.label}</p></div> })}</div><div className="grid gap-5 lg:grid-cols-2"><Link href="/admin/cursos" className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-7 transition hover:border-cyan-300/60"><BookOpen className="text-cyan-300" /><h2 className="mt-5 text-xl font-black text-white">Catálogo e conteúdo</h2><p className="mt-2 text-sm leading-6 text-slate-300">Cadastrar produtos, publicar aulas, materiais e regras de disponibilidade.</p></Link><div className="rounded-3xl border border-white/10 bg-white/[.03] p-7"><CreditCard className="text-violet-300" /><h2 className="mt-5 text-xl font-black text-white">Pagamentos com proteção</h2><p className="mt-2 text-sm leading-6 text-slate-400">O checkout só ativa após preço, produto publicado, token seguro e webhook PagBank configurados.</p></div></div></div>
}
