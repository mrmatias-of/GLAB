'use client'

import { useActionState, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Package, Search } from 'lucide-react'
import { createComboAction, updateComboAction, type ComboActionState } from './actions'
import { centsToInputValue, parsePriceToCents } from '@/lib/price'

type Candidate = {
  id: number
  title: string
  slug: string
  priceCents: number
  isActive: number
  isBundle: number
  included: number
}

type Combo = {
  id: number
  title: string
  slug: string
  description: string | null
  priceCents: number
  isActive: number
  coverUrl: string | null
}

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const initialState: ComboActionState = {}
const fieldClass =
  'rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 focus:border-cyan-300/50 focus:outline-none'

export function ComboForm({ candidates, combo }: { candidates: Candidate[]; combo?: Combo }) {
  const action = combo ? updateComboAction.bind(null, combo.id) : createComboAction
  const [state, formAction, pending] = useActionState(action, initialState)

  const [selected, setSelected] = useState<number[]>(
    candidates.filter((candidate) => candidate.included === 1).map((candidate) => candidate.id),
  )
  const [price, setPrice] = useState(combo ? centsToInputValue(combo.priceCents) : '')
  const [search, setSearch] = useState('')

  const toggle = (id: number) =>
    setSelected((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]))

  const partsCents = useMemo(
    () =>
      candidates
        .filter((candidate) => selected.includes(candidate.id))
        .reduce((total, candidate) => total + candidate.priceCents, 0),
    [candidates, selected],
  )

  const parsedCents = parsePriceToCents(price)
  const comboCents = Number.isFinite(parsedCents) ? parsedCents : 0
  const discount = partsCents > 0 && comboCents > 0 ? 1 - comboCents / partsCents : 0

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return candidates
    return candidates.filter(
      (candidate) =>
        candidate.title.toLowerCase().includes(term) || candidate.slug.toLowerCase().includes(term),
    )
  }, [candidates, search])

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Fonte da verdade do que será salvo, imune ao filtro de busca. */}
      {selected.map((id) => (
        <input key={id} type="hidden" name="itemIds" value={id} />
      ))}

      {state?.error ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-300"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
          {state.error}
        </div>
      ) : null}
      {state?.success ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-medium text-emerald-300">
          <CheckCircle2 size={16} className="shrink-0" aria-hidden />
          Combo salvo com sucesso.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Cursos do combo */}
        <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[.02] p-6">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Cursos que o combo libera</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Ao pagar, o aluno recebe acesso a todos os cursos marcados aqui. O combo em si não aparece na área
              dele, apenas os cursos.
            </p>
          </div>

          <label className="relative flex items-center">
            <Search size={15} className="absolute left-3 text-slate-500" aria-hidden />
            <span className="sr-only">Buscar curso</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar curso por nome"
              className={`${fieldClass} w-full pl-9`}
            />
          </label>

          <ul className="flex max-h-[26rem] flex-col gap-1 overflow-y-auto">
            {visible.map((candidate) => {
              const isNested = candidate.isBundle === 1
              return (
                <li key={candidate.id}>
                  <label
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      isNested ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-white/[.04]'
                    }`}
                  >
                    {/* Sem name: a seleção vai em hidden inputs no fim do
                        form. Um checkbox filtrado pela busca sai do DOM e
                        seria perdido no submit, apagando cursos do combo. */}
                    <input
                      type="checkbox"
                      disabled={isNested}
                      checked={selected.includes(candidate.id)}
                      onChange={() => toggle(candidate.id)}
                      className="h-4 w-4 shrink-0 rounded border-white/20 bg-[#0a0d19] accent-cyan-400"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-white">{candidate.title}</span>
                      <span className="block truncate text-xs text-slate-500">
                        {money.format(candidate.priceCents / 100)}
                        {candidate.isActive === 0 ? ' · rascunho' : ''}
                      </span>
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
            {visible.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs text-slate-500">Nenhum curso encontrado.</li>
            ) : null}
          </ul>
        </section>

        {/* Dados de venda */}
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[.02] p-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Dados de venda</h2>

            <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
              Nome do combo
              <input
                name="title"
                required
                defaultValue={combo?.title}
                placeholder="Ex: Combo Iniciante Mobile"
                className={fieldClass}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
              Preço do combo (R$)
              {/* Campo de texto, não number: o admin digita "29,90" e um
                  input number descarta a vírgula, salvando R$ 2.990,00. */}
              <input
                name="price"
                type="text"
                inputMode="decimal"
                required
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="29,90"
                className={fieldClass}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
              Descrição
              <textarea
                name="description"
                rows={3}
                defaultValue={combo?.description ?? ''}
                placeholder="O que o aluno recebe neste combo"
                className={fieldClass}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
              Slug (URL)
              <input
                name="slug"
                defaultValue={combo?.slug}
                placeholder="gerado a partir do nome se vazio"
                className={fieldClass}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
              URL da capa
              <input
                name="coverUrl"
                defaultValue={combo?.coverUrl ?? ''}
                placeholder="/images/combo.jpg"
                className={fieldClass}
              />
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={combo ? combo.isActive === 1 : true}
                className="h-4 w-4 rounded border-white/20 bg-[#0a0d19] accent-cyan-400"
              />
              Combo publicado (à venda no catálogo)
            </label>
          </section>

          {/* Resumo de preço: ajuda a definir quanto cobrar */}
          <section className="flex flex-col gap-3 rounded-3xl border border-cyan-300/20 bg-cyan-400/[.04] p-6">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-cyan-300" aria-hidden />
              <h2 className="text-sm font-black uppercase tracking-wider text-cyan-200">Resumo</h2>
            </div>

            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-slate-400">Cursos incluídos</dt>
                <dd className="font-black text-white">{selected.length}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-slate-400">Somados avulsos</dt>
                <dd className="font-bold text-white">{money.format(partsCents / 100)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-slate-400">Preço do combo</dt>
                <dd className="font-bold text-white">{money.format(comboCents / 100)}</dd>
              </div>
            </dl>

            {selected.length === 0 ? (
              <p className="text-xs font-bold text-amber-300">Marque ao menos um curso para salvar o combo.</p>
            ) : discount > 0 ? (
              <p className="text-xs font-bold text-emerald-300">
                O aluno economiza {money.format((partsCents - comboCents) / 100)} ({Math.round(discount * 100)}% de
                desconto).
              </p>
            ) : comboCents > partsCents ? (
              <p className="text-xs font-bold text-amber-300">
                O combo está mais caro que comprar os cursos separados.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending || selected.length === 0}
              className="mt-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-black text-[#050810] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? 'Salvando...' : combo ? 'Salvar combo' : 'Criar combo'}
            </button>
          </section>
        </div>
      </div>
    </form>
  )
}
