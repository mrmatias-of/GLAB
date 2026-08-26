'use client'

import { useActionState } from 'react'
import { createProductAction, updateProductAction, type ProductActionState } from './actions'

type Product = {
  id: number
  slug: string
  title: string
  description: string | null
  priceCents: number
  isActive: number
  coverUrl: string | null
}

const initialState: ProductActionState = {}

export function ProductForm({ product }: { product?: Product }) {
  const action = product ? updateProductAction.bind(null, product.id) : createProductAction
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-300">{state.error}</div>
      ) : null}
      {state?.success ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-medium text-emerald-300">Curso salvo com sucesso.</div>
      ) : null}

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        Título do curso
        <input
          name="title"
          required
          defaultValue={product?.title}
          placeholder="Ex: Troca de Tela Profissional"
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 focus:border-cyan-300/50 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        Slug (URL)
        <input
          name="slug"
          defaultValue={product?.slug}
          placeholder="gerado automaticamente a partir do título se vazio"
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 focus:border-cyan-300/50 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        Descrição
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description ?? ''}
          placeholder="Descrição curta do curso"
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 focus:border-cyan-300/50 focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
          Preço (R$)
          <input
            name="price"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={product ? (product.priceCents / 100).toFixed(2) : undefined}
            placeholder="97.00"
            className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 focus:border-cyan-300/50 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
          URL da capa
          <input
            name="coverUrl"
            defaultValue={product?.coverUrl ?? ''}
            placeholder="/images/curso.jpg"
            className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 focus:border-cyan-300/50 focus:outline-none"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-xs font-bold text-slate-400">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={product ? product.isActive === 1 : true}
          className="h-4 w-4 rounded border-white/20 bg-[#0a0d19] accent-cyan-400"
        />
        Curso publicado (visível no catálogo)
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-black text-[#050810] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? 'Salvando...' : product ? 'Salvar alterações' : 'Criar curso'}
      </button>
    </form>
  )
}
