'use client'

import { FormEvent, useState } from 'react'
import { ExternalLink, Loader2, ShieldCheck } from 'lucide-react'
import { brl } from '@/lib/format'

const inputClass = 'field h-14 rounded-xl border-white/[.14] px-4 text-sm font-semibold'

type Product = {
  slug: string
  title: string
  priceCents: number
}

export function HostedPagBankCheckout({ product }: { product: Product }) {
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/checkout/hosted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug: product.slug, buyerName, buyerEmail }),
      })
      const data = await response.json()
      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? 'Não foi possível abrir o checkout seguro agora.')
      }
      window.location.href = data.checkoutUrl
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Não foi possível abrir o checkout seguro agora.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-7 rounded-2xl border border-cyan-300/20 bg-cyan-300/[.06] p-5 shadow-[0_20px_70px_rgba(34,211,238,.08)]">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-200">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">Opção recomendada</p>
          <h2 className="mt-2 text-xl font-black text-white">Checkout oficial PagBank</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Se preferir, finalize em uma página protegida do PagBank com Pix, cartão ou boleto. O acesso será liberado após a confirmação do pagamento.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2">
        <input
          required
          value={buyerName}
          onChange={(event) => setBuyerName(event.target.value)}
          placeholder="Nome completo"
          aria-label="Nome completo para o checkout PagBank"
          className={`${inputClass} sm:col-span-2`}
        />
        <input
          required
          type="email"
          value={buyerEmail}
          onChange={(event) => setBuyerEmail(event.target.value)}
          placeholder="Seu melhor e-mail"
          aria-label="E-mail para o checkout PagBank"
          className={inputClass}
        />
        <button
          disabled={loading}
          className="flex h-14 items-center justify-center gap-2 rounded-xl bg-white text-sm font-black text-[#04101d] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <ExternalLink size={18} />}
          {loading ? 'Abrindo PagBank...' : `Pagar no PagBank · ${brl(product.priceCents)}`}
        </button>
      </form>

      {error ? (
        <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm leading-6 text-red-200">{error}</p>
      ) : null}
    </div>
  )
}
