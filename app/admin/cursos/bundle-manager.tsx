'use client'

import { useActionState, useState } from 'react'
import { Package } from 'lucide-react'
import { setBundleItemsAction, type BundleActionState } from './actions'

type Candidate = {
  id: number
  title: string
  slug: string
  isBundle: number
  included: number
}

const initialState: BundleActionState = {}

export function BundleManager({ productId, candidates }: { productId: number; candidates: Candidate[] }) {
  const action = setBundleItemsAction.bind(null, productId)
  const [state, formAction, pending] = useActionState(action, initialState)
  const [selected, setSelected] = useState<number[]>(
    candidates.filter((item) => item.included === 1).map((item) => item.id),
  )

  const toggle = (id: number) =>
    setSelected((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]))

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[.02] p-6">
      <div className="flex items-start gap-3">
        <Package size={18} className="mt-0.5 shrink-0 text-cyan-300" aria-hidden />
        <p className="text-xs leading-relaxed text-slate-400">
          Marque os cursos que este produto libera. Com pelo menos um curso marcado, ele passa a ser um{' '}
          <strong className="text-slate-200">combo</strong>: ao pagar, o aluno recebe acesso a todos os cursos da
          lista. Sem nenhum marcado, é um curso comum e libera apenas a si mesmo.
        </p>
      </div>

      {state?.error ? (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-300">
          {state.error}
        </div>
      ) : null}
      {state?.success ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-medium text-emerald-300">
          Conteúdo do combo salvo.
        </div>
      ) : null}

      <p className="text-xs font-bold text-slate-500">
        {selected.length === 0
          ? 'Nenhum curso marcado — produto avulso'
          : `${selected.length} ${selected.length === 1 ? 'curso incluído' : 'cursos incluídos'}`}
      </p>

      <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto">
        {candidates.map((candidate) => {
          const isNested = candidate.isBundle === 1
          return (
            <li key={candidate.id}>
              <label
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isNested ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-white/[.04]'
                }`}
              >
                <input
                  type="checkbox"
                  name="itemIds"
                  value={candidate.id}
                  disabled={isNested}
                  checked={selected.includes(candidate.id)}
                  onChange={() => toggle(candidate.id)}
                  className="h-4 w-4 shrink-0 rounded border-white/20 bg-[#0a0d19] accent-cyan-400"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-white">{candidate.title}</span>
                  <span className="block truncate text-xs text-slate-500">{candidate.slug}</span>
                </span>
                {isNested ? (
                  <span className="shrink-0 rounded bg-white/5 px-2 py-1 text-[10px] font-bold uppercase text-slate-400">
                    é combo
                  </span>
                ) : null}
              </label>
            </li>
          )
        })}
      </ul>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-black text-[#050810] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? 'Salvando...' : 'Salvar conteúdo do combo'}
      </button>
    </form>
  )
}
