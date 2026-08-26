import { Metadata } from 'next'
import { Users } from 'lucide-react'
import { platformStudents } from '@/lib/learning-platform'

export const metadata: Metadata = {
  title: 'Alunos | Painel Admin',
  description: 'Base de alunos da plataforma',
}

export const dynamic = 'force-dynamic'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const date = new Intl.DateTimeFormat('pt-BR')

export default async function AlunosPage() {
  const students = await platformStudents()

  return (
    <div className="space-y-8 text-white">
      <div>
        <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Base de alunos</p>
        <h1 className="mt-2 text-3xl font-black">Alunos</h1>
        <p className="mt-2 text-sm text-slate-400">Todos os usuários cadastrados na plataforma, com histórico de compras e acessos ativos.</p>
      </div>

      {students.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[.025] p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <Users size={24} />
          </span>
          <h2 className="mt-5 text-xl font-black">Nenhum aluno cadastrado ainda</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">Quando alguém se cadastrar na plataforma, o registro aparece aqui automaticamente.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10">
          <div className="hidden grid-cols-[1.4fr_1fr_110px_110px_130px] gap-4 border-b border-white/10 bg-white/[.04] px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 md:grid">
            <span>Aluno</span>
            <span>E-mail</span>
            <span>Acessos ativos</span>
            <span>Pedidos pagos</span>
            <span>Total gasto</span>
          </div>
          {students.map((student) => (
            <div key={student.email} className="grid gap-2 border-b border-white/10 bg-[#0a0d19] px-6 py-5 last:border-0 md:grid-cols-[1.4fr_1fr_110px_110px_130px] md:items-center">
              <div>
                <p className="font-bold">{student.name || 'Sem nome'}</p>
                <p className="mt-1 text-xs text-slate-500">desde {date.format(new Date(student.createdAt))}</p>
              </div>
              <p className="truncate text-sm text-slate-300">{student.email}</p>
              <p className="text-sm font-bold">{student.activeEnrollments}</p>
              <p className="text-sm font-bold">{student.totalOrders}</p>
              <p className="text-sm font-bold text-emerald-300">{money.format(student.totalSpentCents / 100)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
