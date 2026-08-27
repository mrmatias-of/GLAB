'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Check, Copy, Loader2, ShieldCheck } from 'lucide-react'

declare global {
  interface Window {
    PagSeguro?: { encryptCard(input: { publicKey: string; holder: string; number: string; expMonth: string; expYear: string; securityCode: string }): { hasErrors: boolean; errors?: Array<{ message?: string }>; encryptedCard?: string } }
  }
}

type Product = { slug: string; title: string; priceCents: number }
type Result = { orderId: string; status?: string; pix?: { text: string; imageUrl?: string | null } }

const inputClass = 'field h-14 rounded-xl border-white/[.14] px-4 text-sm font-semibold'

export function CheckoutForm({ product }: { product: Product }) {
  const [method, setMethod] = useState<'PIX' | 'CARD'>('PIX')
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [taxId, setTaxId] = useState(''); const [number, setNumber] = useState(''); const [holder, setHolder] = useState(''); const [expiry, setExpiry] = useState(''); const [cvv, setCvv] = useState(''); const [installments, setInstallments] = useState('1')
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const [copied, setCopied] = useState(false); const [result, setResult] = useState<Result | null>(null); const [paid, setPaid] = useState(false)

  useEffect(() => { const script = document.createElement('script'); script.src = 'https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js'; script.async = true; document.body.appendChild(script); return () => script.remove() }, [])
  useEffect(() => { if (!result?.pix || paid) return; const timer = window.setInterval(async () => { const response = await fetch(`/api/checkout/status/${result.orderId}`); if (!response.ok) return; const data = await response.json(); if (data.status === 'PAID') { setPaid(true); window.clearInterval(timer) } }, 4000); return () => window.clearInterval(timer) }, [result, paid])

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      let encryptedCard: string | undefined
      if (method === 'CARD') {
        const response = await fetch('/api/checkout/public-key'); const { publicKey } = await response.json()
        if (!window.PagSeguro) throw new Error('O checkout seguro ainda está carregando. Tente novamente.')
        const [month, year] = expiry.split('/')
        const card = window.PagSeguro.encryptCard({ publicKey, holder, number: number.replace(/\D/g, ''), expMonth: month ?? '', expYear: `20${year ?? ''}`, securityCode: cvv })
        if (card.hasErrors || !card.encryptedCard) throw new Error(card.errors?.[0]?.message ?? 'Confira os dados do cartão.')
        encryptedCard = card.encryptedCard
      }
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productSlug: product.slug, buyerName: name, buyerEmail: email, taxId: taxId.replace(/\D/g, ''), method, encryptedCard, installments: Number(installments) }) })
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Não foi possível iniciar o pagamento.'); setResult(data)
    } catch (exception) { setError(exception instanceof Error ? exception.message : 'Não foi possível iniciar o pagamento.') } finally { setLoading(false) }
  }

  if (paid) return <div className="flex flex-col items-center gap-5 py-10 text-center"><div className="flex size-16 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300"><Check /></div><h2 className="text-2xl font-black text-white">Pagamento aprovado</h2><p className="max-w-sm text-sm leading-6 text-slate-300">Seu acesso foi liberado. Verifique o e-mail <strong className="text-white">{email}</strong>.</p><a href="/sign-in" className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-8 text-sm font-black text-[#04101d]">Entrar na plataforma</a></div>
  if (result) return <div className="flex flex-col items-center gap-6 py-6 text-center"><div className="flex size-14 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300"><ShieldCheck /></div><div><h2 className="text-2xl font-black text-white">{result.pix ? 'Pix gerado' : 'Pagamento enviado'}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{result.pix ? 'Pague pelo QR Code. Atualizaremos esta tela após a confirmação.' : 'Seu pagamento foi enviado para análise.'}</p></div>{result.pix && <div className="flex w-full flex-col items-center gap-4">{result.pix.imageUrl && <img src={result.pix.imageUrl} alt="QR Code para pagamento via Pix" className="size-52 rounded-xl bg-white p-2" />}<textarea readOnly value={result.pix.text} className="min-h-28 w-full resize-none rounded-xl border border-white/10 bg-[#050712] p-4 text-xs leading-5 text-slate-300" /><button type="button" onClick={() => { navigator.clipboard.writeText(result.pix!.text); setCopied(true); window.setTimeout(() => setCopied(false), 1800) }} className="inline-flex h-12 items-center gap-2 rounded-xl bg-cyan-300 px-6 text-sm font-black text-[#04101d]"><Copy /> {copied ? 'Código copiado' : 'Copiar código Pix'}</button></div>}<p className="text-xs text-slate-500">Pedido: {result.orderId}</p></div>
  return <form onSubmit={submit} className="flex flex-col gap-6"><div className="flex flex-col gap-3"><div><p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">Dados de acesso</p><p className="mt-2 text-sm text-slate-400">Você receberá as instruções neste e-mail.</p></div><div className="grid gap-3 sm:grid-cols-2"><input required value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" aria-label="Nome completo" className={`${inputClass} sm:col-span-2`} /><input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu melhor e-mail" aria-label="Seu melhor e-mail" className={inputClass} /><input required value={taxId} onChange={e => setTaxId(e.target.value)} placeholder="CPF" aria-label="CPF" inputMode="numeric" className={inputClass} /></div></div><div className="flex flex-col gap-3"><p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">Forma de pagamento</p><div className="grid grid-cols-2 gap-2 rounded-xl border border-white/[.08] bg-[#050712] p-1"><button type="button" onClick={() => setMethod('PIX')} className={`h-12 rounded-lg text-sm font-black ${method === 'PIX' ? 'bg-cyan-300 text-[#04101d]' : 'text-slate-400'}`}>Pix</button><button type="button" onClick={() => setMethod('CARD')} className={`h-12 rounded-lg text-sm font-black ${method === 'CARD' ? 'bg-cyan-300 text-[#04101d]' : 'text-slate-400'}`}>Cartão</button></div></div>{method === 'CARD' && <div className="grid gap-3"><input required value={holder} onChange={e => setHolder(e.target.value)} placeholder="Nome no cartão" aria-label="Nome no cartão" className={inputClass} /><input required value={number} onChange={e => setNumber(e.target.value)} placeholder="Número do cartão" aria-label="Número do cartão" inputMode="numeric" className={inputClass} /><div className="grid grid-cols-3 gap-3"><input required value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/AA" aria-label="Validade" className={inputClass} /><input required value={cvv} onChange={e => setCvv(e.target.value)} placeholder="CVV" aria-label="CVV" inputMode="numeric" className={inputClass} /><select value={installments} onChange={e => setInstallments(e.target.value)} aria-label="Parcelas" className={inputClass}><option value="1">1x</option><option value="2">2x</option><option value="3">3x</option><option value="6">6x</option><option value="12">12x</option></select></div></div>}{error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm leading-6 text-red-200">{error}</p>}<button disabled={loading} className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 text-base font-black text-[#04101d] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">{loading && <Loader2 className="animate-spin" />} {loading ? 'Processando pagamento...' : 'Finalizar compra'}</button><p className="flex items-center justify-center gap-2 text-center text-xs leading-5 text-slate-500"><ShieldCheck /> Ambiente protegido pelo PagBank</p></form>
}
