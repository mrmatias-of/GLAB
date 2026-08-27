import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { bundleCandidates, platformProductById } from '@/lib/learning-platform'
import { ComboForm } from '../combo-form'
import { dissolveComboAction } from '../actions'

export const metadata: Metadata = {
  title: 'Editar combo | Painel Admin',
  description: 'Editar combo de venda',
}

export const dynamic = 'force-dynamic'

export default async function EditarComboPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const comboId = Number(id)
  if (!Number.isInteger(comboId) || comboId <= 0) notFound()

  const [combo, candidates] = await Promise.all([platformProductById(comboId), bundleCandidates(comboId)])
  if (!combo) notFound()

  const includedCount = candidates.filter((candidate) => candidate.included === 1).length

  return (
    <div className="space-y-6 text-white">
      <Link href="/admin/combos" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-300">
        <ArrowLeft size={14} /> Voltar para combos
      </Link>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Combo de venda</p>
          <h1 className="mt-2 text-3xl font-black">{combo.title}</h1>
          <p className="mt-2 text-sm text-slate-400">
            Libera {includedCount} {includedCount === 1 ? 'curso' : 'cursos'} para o aluno após o pagamento.
          </p>
        </div>
        <Link
          href={`/cursos/${combo.slug}`}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:border-cyan-300/50 hover:text-cyan-200"
        >
          Ver página de venda <ExternalLink size={14} />
        </Link>
      </div>

      <ComboForm candidates={candidates} combo={combo} />

      <form action={dissolveComboAction.bind(null, comboId)} className="rounded-3xl border border-white/10 bg-white/[.02] p-6">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Desfazer combo</h2>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-500">
          O produto continua no catálogo, mas deixa de liberar outros cursos. Alunos que já compraram mantêm o
          acesso que receberam.
        </p>
        <button
          type="submit"
          className="mt-4 rounded-xl border border-red-500/30 px-4 py-2.5 text-xs font-bold text-red-300 transition-colors hover:bg-red-500/10"
        >
          Desfazer combo
        </button>
      </form>
    </div>
  )
}
