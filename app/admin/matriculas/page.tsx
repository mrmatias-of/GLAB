import { Metadata } from 'next'
import { GraduationCap, CheckCircle2, XCircle } from 'lucide-react'
import { platformEnrollments, platformProducts } from '@/lib/learning-platform'
import { EnrollmentForm } from './enrollment-form'

export const metadata: Metadata = {
  title: 'Matrículas | Painel Admin',
  description: 'Acessos liberados por curso',
}

export const dynamic = 'force-dynamic'

const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

const statusLabel: Record<string, string> = {
  ACTIVE: 'Ativa',
  REVOKED: 'Revogada',
}

export default async function MatriculasPage() {
  const [enrollments, products] = await Promise.all([platformEnrollments(), platformProducts()])

  return (
    <div className="space-y-8 text-white">
      <div>
        <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Acesso ao conteúdo</p>
        <h1 className="mt-2 text-3xl font-black">Matrículas</h1>
        <p className="mt-2 text-sm text-slate-400">Cada matrícula libera o conteúdo de um curso para um aluno após a compra confirmada.</p>
      </div>

      <EnrollmentForm products={products.map((product) => ({ id: product.id, title: product.title }))} />

      {enrollments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[.025] p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <GraduationCap size={24} />
          </span>
          <h2 className="mt-5 text-xl font-black">Nenhuma matrícula ainda</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">As matrículas são criadas automaticamente quando um pedido é confirmado como pago.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10">
          <div className="hidden grid-cols-[1.2fr_1.2fr_110px_160px] gap-4 border-b border-white/10 bg-white/[.04] px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 md:grid">
            <span>Aluno</span>
            <span>Curso</span>
            <span>Status</span>
            <span>Liberado em</span>
          </div>
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="grid gap-2 border-b border-white/10 bg-[#0a0d19] px-6 py-5 last:border-0 md:grid-cols-[1.2fr_1.2fr_110px_160px] md:items-center">
              <div>
                <p className="font-bold">{enrollment.studentName || 'Sem nome'}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{enrollment.studentEmail}</p>
              </div>
              <div>
                <p className="font-bold">{enrollment.productTitle}</p>
                <p className="mt-1 text-xs text-slate-500">/{enrollment.productSlug}</p>
              </div>
              <span className={enrollment.status === 'ACTIVE' ? 'inline-flex w-fit items-center gap-2 text-xs font-bold text-emerald-300' : 'inline-flex w-fit items-center gap-2 text-xs font-bold text-red-300'}>
                {enrollment.status === 'ACTIVE' ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                {statusLabel[enrollment.status] ?? enrollment.status}
              </span>
              <p className="text-xs text-slate-500">{date.format(new Date(enrollment.grantedAt))}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
