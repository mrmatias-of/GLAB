'use client'

import { FormEvent, useState } from 'react'
import { Barcode, CreditCard, ExternalLink, Loader2, LockKeyhole, QrCode } from 'lucide-react'
import { brl } from '@/lib/format'

const inputClass = 'field h-14 w-full rounded-xl border-white/[.14] px-4 text-sm font-semibold'

const PAYMENT_METHODS = [
  { icon: QrCode, label: 'Pix' },
  { icon: CreditCard, label: 'Cartão' },
  { icon: Barcode, label: 'Boleto' },
]

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
      // O loading segue ativo de propósito: a navegação para o PagBank é
      // assíncrona e reativar o botão aqui causaria um piscar indesejado.
      window.location.href = data.checkoutUrl
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Não foi possível abrir o checkout seguro agora.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-[.14em] text-slate-400">Nome completo</span>
          <input
            required
            minLength={3}
            maxLength={160}
            value={buyerName}
            onChange={event => setBuyerName(event.target.value)}
            placeholder="Como está no seu documento"
            autoComplete="name"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-[.14em] text-slate-400">E-mail</span>
          <input
            required
            type="email"
            value={buyerEmail}
            onChange={event => setBuyerEmail(event.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            className={inputClass}
          />
          <span className="text-xs leading-5 text-slate-500">É neste e-mail que o acesso ao curso será liberado.</span>
        </label>
      </div>

      <div className="rounded-2xl border border-white/[.1] bg-white/[.03] p-5">
        <p className="text-xs font-black uppercase tracking-[.16em] text-cyan-300">Formas de pagamento no PagBank</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {PAYMENT_METHODS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[.12] bg-white/[.04] px-3 py-2 text-xs font-bold text-slate-200"
            >
              <Icon size={16} className="text-cyan-300" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Você continua em uma página oficial do PagBank para escolher a forma de pagamento. Seus dados de cartão são
          digitados apenas lá e nunca passam pelo G-LAB.
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm leading-6 text-red-200">
          {error}
        </p>
      ) : null}

      <button
        disabled={loading}
        className="flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 text-sm font-black text-[#04101d] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <ExternalLink size={18} aria-hidden="true" />}
        {loading ? 'Abrindo o PagBank...' : `Ir para o pagamento · ${brl(product.priceCents)}`}
      </button>

      <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
        <LockKeyhole size={14} className="text-cyan-300" aria-hidden="true" />
        Ambiente protegido — o acesso é liberado após a confirmação
      </p>
    </form>
  )
}
