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

  if (paid) return <div className="space-y-5 py-8 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300"><Check size={32} /></div><h2 className="text-2xl font-black">Pagamento aprovado</h2><p className="text-sm leading-6 text-slate-300">Seu acesso foi liberado. Verifique o e-mail <strong className="text-white">{email}</strong> com as instruções para entrar.</p><a href="/sign-in" className="inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-black text-[#04101d]">Entrar na plataforma</a></div>
  if (result) return <div className="space-y-6 py-3 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300"><ShieldCheck size={28} /></div><div><h2 className="text-2xl font-black">{result.pix ? 'Pix gerado' : 'Pagamento enviado'}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{result.pix ? 'Copie o código abaixo. Esta tela será atualizada quando o pagamento for confirmado.' : 'Seu pagamento foi enviado para análise.'}</p></div>{result.pix && <div className="space-y-3">{result.pix.imageUrl && <img src={result.pix.imageUrl} alt="QR Code para pagamento via Pix" className="mx-auto h-48 w-48 rounded-xl bg-white p-2" />}<textarea readOnly value={result.pix.text} className="min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-[#050712] p-4 text-xs leading-5 text-slate-300" /><button type="button" onClick={() => { navigator.clipboard.writeText(result.pix!.text); setCopied(true); window.setTimeout(() => setCopied(false), 1800) }} className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-black text-[#04101d]"><Copy size={16} /> {copied ? 'Copiado' : 'Copiar Pix'}</button></div>}<p className="text-xs text-slate-500">Pedido: {result.orderId}</p></div>
  return <form onSubmit={submit} className="space-y-5"><div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#050712] p-1"><button type="button" onClick={() => setMethod('PIX')} className={`rounded-xl px-4 py-3 text-sm font-bold ${method === 'PIX' ? 'bg-cyan-400 text-[#04101d]' : 'text-slate-400'}`}>Pix</button><button type="button" onClick={() => setMethod('CARD')} className={`rounded-xl px-4 py-3 text-sm font-bold ${method === 'CARD' ? 'bg-cyan-400 text-[#04101d]' : 'text-slate-400'}`}>Cartão</button></div><div className="grid gap-3 sm:grid-cols-2"><input required value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" className="field sm:col-span-2" /><input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu melhor e-mail" className="field" /><input required value={taxId} onChange={e => setTaxId(e.target.value)} placeholder="CPF" inputMode="numeric" className="field" /></div>{method === 'CARD' && <div className="grid gap-3"><input required value={holder} onChange={e => setHolder(e.target.value)} placeholder="Nome no cartão" className="field" /><input required value={number} onChange={e => setNumber(e.target.value)} placeholder="Número do cartão" inputMode="numeric" className="field" /><div className="grid grid-cols-3 gap-3"><input required value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/AA" className="field" /><input required value={cvv} onChange={e => setCvv(e.target.value)} placeholder="CVV" inputMode="numeric" className="field" /><select value={installments} onChange={e => setInstallments(e.target.value)} className="field"><option value="1">1x</option><option value="2">2x</option><option value="3">3x</option><option value="6">6x</option><option value="12">12x</option></select></div></div>} {error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}<button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-4 text-sm font-black text-[#04101d] disabled:cursor-wait disabled:opacity-60">{loading && <Loader2 size={17} className="animate-spin" />}{loading ? 'Processando...' : method === 'PIX' ? 'Gerar Pix' : 'Pagar com cartão'}</button><p className="text-center text-xs leading-5 text-slate-500">Ao continuar, você concorda com os termos de compra. O pagamento é processado com segurança pelo PagBank.</p></form>
}
