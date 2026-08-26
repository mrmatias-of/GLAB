import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Users, GraduationCap, TrendingUp, Ticket, Settings, ArrowUpRight } from 'lucide-react'
import { platformAdminSummary, platformSalesSummary } from '@/lib/learning-platform'

export const metadata: Metadata = {
  title: 'Painel Admin | G•Lab Cursos',
  description: 'Painel administrativo da plataforma de cursos',
}

export const dynamic = 'force-dynamic'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const modules = [
  { name: 'Cursos', href: '/admin/cursos', icon: BookOpen, description: 'Gerenciar catálogo e conteúdo', accent: 'text-cyan-300' },
  { name: 'Alunos', href: '/admin/alunos', icon: Users, description: 'Base de alunos e histórico de compras', accent: 'text-blue-300' },
  { name: 'Matrículas', href: '/admin/matriculas', icon: GraduationCap, description: 'Acessos liberados por curso', accent: 'text-emerald-300' },
  { name: 'Vendas', href: '/admin/vendas', icon: TrendingUp, description: 'Pedidos, receita e status de pagamento', accent: 'text-amber-300' },
  { name: 'Cupons', href: '/admin/cupons', icon: Ticket, description: 'Descontos e campanhas promocionais', accent: 'text-pink-300' },
  { name: 'Configurações', href: '/admin/configuracoes', icon: Settings, description: 'Ajustes gerais da plataforma', accent: 'text-purple-300' },
]

export default async function AdminDashboard() {
  const [summary, sales] = await Promise.all([platformAdminSummary(), platformSalesSummary()])

  const stats = [
    { label: 'Receita confirmada', value: money.format(sales.revenueCents / 100) },
    { label: 'Cursos publicados', value: `${summary.activeProducts} / ${summary.products}` },
    { label: 'Alunos com acesso ativo', value: summary.students },
    { label: 'Pedidos pagos', value: sales.paidOrders },
  ]

  return (
    <div className="space-y-8 text-white">
      <div>
        <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Visão geral</p>
        <h1 className="mt-2 text-3xl font-black">Painel administrativo G·LAB</h1>
        <p className="mt-2 text-sm text-slate-400">Acompanhe vendas, alunos e catálogo em tempo real, direto do banco de produção.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-500">Módulos</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Link key={mod.href} href={mod.href} className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.03] p-5 transition-all hover:border-cyan-300/40 hover:bg-white/[.05]">
              <div className="flex items-center gap-4">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ${mod.accent}`}>
                  <mod.icon size={20} />
                </span>
                <div>
                  <p className="font-bold">{mod.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{mod.description}</p>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-slate-600 transition-colors group-hover:text-cyan-300" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
