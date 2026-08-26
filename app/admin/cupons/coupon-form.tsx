'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Plus } from 'lucide-react'
import { createCouponAction, type CreateCouponActionState } from './actions'

type Product = { id: number; title: string }

const initialState: CreateCouponActionState = {}

export function CouponForm({ products }: { products: Product[] }) {
  const [state, formAction, pending] = useActionState(createCouponAction, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) formRef.current?.reset()
  }, [state.success])

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="sm:col-span-2 lg:col-span-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Novo cupom</h2>
      </div>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        Código
        <input
          name="code"
          required
          maxLength={40}
          placeholder="EX: BEMVINDO10"
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 focus:border-cyan-300/50 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        Descrição (opcional)
        <input
          name="description"
          maxLength={200}
          placeholder="Campanha de boas-vindas"
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 focus:border-cyan-300/50 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        Curso (opcional — vazio aplica a todos)
        <select
          name="productId"
          defaultValue=""
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white focus:border-cyan-300/50 focus:outline-none"
        >
          <option value="">Todos os cursos</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        Tipo de desconto
        <select
          name="discountType"
          defaultValue="PERCENT"
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white focus:border-cyan-300/50 focus:outline-none"
        >
          <option value="PERCENT">Percentual (%)</option>
          <option value="FIXED">Valor fixo (R$)</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        Valor do desconto
        <input
          name="discountValue"
          type="number"
          min={1}
          step="0.01"
          required
          placeholder="10"
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 focus:border-cyan-300/50 focus:outline-none"
        />
        <span className="text-[11px] font-medium text-slate-500">Percentual: número de 1 a 100. Valor fixo: em reais (ex: 25 para R$ 25,00).</span>
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        Limite de usos (opcional)
        <input
          name="maxRedemptions"
          type="number"
          min={1}
          placeholder="Ilimitado"
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 focus:border-cyan-300/50 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        Expira em (opcional)
        <input
          name="expiresAt"
          type="datetime-local"
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white focus:border-cyan-300/50 focus:outline-none"
        />
      </label>

      <div className="flex items-end sm:col-span-2 lg:col-span-1">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition-opacity disabled:opacity-60"
        >
          <Plus size={16} />
          {pending ? 'Criando...' : 'Criar cupom'}
        </button>
      </div>

      {state.error ? (
        <p className="sm:col-span-2 lg:col-span-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-200">
          {state.error}
        </p>
      ) : null}
    </form>
  )
}
