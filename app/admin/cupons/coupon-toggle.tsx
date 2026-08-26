'use client'

import { useTransition } from 'react'
import { toggleCouponAction } from './actions'

export function CouponToggle({ id, isActive }: { id: number; isActive: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => toggleCouponAction(id, !isActive))}
      className={
        isActive
          ? 'inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300 transition-opacity disabled:opacity-60'
          : 'inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-400 transition-opacity disabled:opacity-60'
      }
    >
      {isPending ? 'Aguarde...' : isActive ? 'Ativo' : 'Inativo'}
    </button>
  )
}
