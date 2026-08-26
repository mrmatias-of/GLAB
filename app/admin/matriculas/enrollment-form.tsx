'use client'

import { useActionState, useEffect, useRef } from 'react'
import { UserPlus } from 'lucide-react'
import { grantManualEnrollmentAction, type ManualEnrollmentActionState } from './actions'

type Product = { id: number; title: string }

const initialState: ManualEnrollmentActionState = {}

export function EnrollmentForm({ products }: { products: Product[] }) {
  const [state, formAction, pending] = useActionState(grantManualEnrollmentAction, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) formRef.current?.reset()
  }, [state.success])

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_auto]">
      <div className="sm:col-span-2 lg:col-span-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Liberar acesso manualmente</h2>
        <p className="mt-1 text-xs text-slate-500">Use enquanto o checkout automático não está disponível. Cria um pedido pago e a matrícula do aluno no curso escolhido.</p>
      </div>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        E-mail do aluno
        <input
          name="studentEmail"
          type="email"
          required
          placeholder="aluno@email.com"
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 focus:border-cyan-300/50 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        Curso
        <select
          name="productId"
          required
          defaultValue=""
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white focus:border-cyan-300/50 focus:outline-none"
        >
          <option value="" disabled>
            Selecione um curso
          </option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition-opacity disabled:opacity-60"
        >
          <UserPlus size={16} />
          {pending ? 'Liberando...' : 'Liberar acesso'}
        </button>
      </div>

      {state.error ? (
        <p className="sm:col-span-2 lg:col-span-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-200">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="sm:col-span-2 lg:col-span-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-200">
          Acesso liberado com sucesso.
        </p>
      ) : null}
    </form>
  )
}
