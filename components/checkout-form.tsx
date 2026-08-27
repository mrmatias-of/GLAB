'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Check, Copy, Loader2, ShieldCheck } from 'lucide-react'
import { brl } from '@/lib/format'

declare global {
  interface Window {
    PagSeguro?: { encryptCard(input: { publicKey: string; holder: string; number: string; expMonth: string; expYear: string; securityCode: string }): { hasErrors: boolean; errors?: Array<{ message?: string }>; encryptedCard?: string } }
  }
}

type Product = { slug: string; title: string; priceCents: number }
type Result = { orderId: string; status?: string; pix?: { text: string; imageUrl?: string | null } }

const inputClass = 'field h-14 rounded-xl border-white/[.14] px-4 text-sm font-semibold'

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
}

type CardBrand = { name: string; cvvLength: number; maxLength: number; gaps: number[] }

// Bandeiras aceitas pelo PagBank. A bandeira não é enviada na requisição:
// o PagBank a identifica pelo número. Servem para validar e orientar o usuário.
const CARD_BRANDS: Array<{ pattern: RegExp } & CardBrand> = [
  { pattern: /^4/, name: 'Visa', cvvLength: 3, maxLength: 16, gaps: [4, 8, 12] },
  { pattern: /^(5[1-5]|2(2[2-9]|[3-6]|7[01]|720))/, name: 'Mastercard', cvvLength: 3, maxLength: 16, gaps: [4, 8, 12] },
  { pattern: /^3[47]/, name: 'American Express', cvvLength: 4, maxLength: 15, gaps: [4, 10] },
  { pattern: /^(4011(78|79)|43(1274|8935)|45(1416|7393|763[12])|50(4175|67[0-9]{2}|9[0-9]{3})|627780|63(6297|6368)|65(0(0(3[1-3]|4[0-9]|5[01])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5[0-9]{2})|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8])))/, name: 'Elo', cvvLength: 3, maxLength: 16, gaps: [4, 8, 12] },
  { pattern: /^(38|60)/, name: 'Hipercard', cvvLength: 3, maxLength: 19, gaps: [4, 8, 12] },
  { pattern: /^3(0[0-5]|[68])/, name: 'Diners', cvvLength: 3, maxLength: 14, gaps: [4, 10] },
  { pattern: /^6(011|5)/, name: 'Discover', cvvLength: 3, maxLength: 16, gaps: [4, 8, 12] },
]

const DEFAULT_BRAND: CardBrand = { name: '', cvvLength: 3, maxLength: 19, gaps: [4, 8, 12, 16] }

function detectCardBrand(digits: string): CardBrand {
  if (!digits) return DEFAULT_BRAND
  const match = CARD_BRANDS.find(brand => brand.pattern.test(digits))
  return match ? { name: match.name, cvvLength: match.cvvLength, maxLength: match.maxLength, gaps: match.gaps } : DEFAULT_BRAND
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '')
  const { maxLength, gaps } = detectCardBrand(digits)
  const trimmed = digits.slice(0, maxLength)
  let formatted = ''
  for (let index = 0; index < trimmed.length; index += 1) {
    if (gaps.includes(index)) formatted += ' '
    formatted += trimmed[index]
  }
  return formatted
}

function formatExpiry(value: string, isDeleting = false) {
  const digits = value.replace(/\D/g, '').slice(0, 6)
  if (digits.length < 2) return digits
  // Ao apagar, não reinsere a barra para permitir voltar até o mês.
  if (digits.length === 2) return isDeleting ? digits : `${digits}/`
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function parseExpiry(value: string) {
  const digits = value.replace(/\D/g, '')
  const month = digits.slice(0, 2)
  const rest = digits.slice(2)
  const year = rest.length === 4 ? rest : rest.length === 2 ? `20${rest}` : ''
  return { month, year }
}

function isValidCardNumber(digits: string) {
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0
  let double = false
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])
    if (double) { digit *= 2; if (digit > 9) digit -= 9 }
    sum += digit
    double = !double
  }
  return sum % 10 === 0
}

export function CheckoutForm({ product }: { product: Product }) {
  const [method, setMethod] = useState<'PIX' | 'CARD'>('PIX')
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [taxId, setTaxId] = useState(''); const [number, setNumber] = useState(''); const [holder, setHolder] = useState(''); const [expiry, setExpiry] = useState(''); const [cvv, setCvv] = useState(''); const [installments, setInstallments] = useState('1')
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const [copied, setCopied] = useState(false); const [result, setResult] = useState<Result | null>(null); const [paid, setPaid] = useState(false)
  const cardDigits = number.replace(/\D/g, '')
  const brand = detectCardBrand(cardDigits)
  const brandUnknown = cardDigits.length >= 6 && !brand.name

  useEffect(() => { const script = document.createElement('script'); script.src = 'https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js'; script.async = true; document.body.appendChild(script); return () => script.remove() }, [])
  useEffect(() => { if (!result || paid) return; const timer = window.setInterval(async () => { const response = await fetch(`/api/checkout/status/${result.orderId}`); if (!response.ok) return; const data = await response.json(); if (data.status === 'PAID') { setPaid(true); window.clearInterval(timer) } }, 4000); return () => window.clearInterval(timer) }, [result, paid])

  useEffect(() => { setCvv(current => (current.length > brand.cvvLength ? current.slice(0, brand.cvvLength) : current)) }, [brand.cvvLength])

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      let encryptedCard: string | undefined
      if (method === 'CARD') {
        const response = await fetch('/api/checkout/public-key'); const { publicKey } = await response.json()
        if (!window.PagSeguro) throw new Error('O checkout seguro ainda está carregando. Tente novamente.')
        if (!publicKey) throw new Error('Não foi possível iniciar o ambiente seguro do PagBank. Tente novamente.')
        if (!isValidCardNumber(cardDigits)) throw new Error('Número do cartão inválido. Confira os dígitos.')
        const { month, year } = parseExpiry(expiry)
        if (!month || Number(month) < 1 || Number(month) > 12) throw new Error('Mês de validade inválido. Use o formato MM/AA.')
        if (!year) throw new Error('Validade incompleta. Use o formato MM/AA.')
        const lastDay = new Date(Number(year), Number(month), 0, 23, 59, 59)
        if (lastDay.getTime() < Date.now()) throw new Error('Este cartão está vencido. Confira a validade.')
        const securityCode = cvv.replace(/\D/g, '')
        if (securityCode.length !== brand.cvvLength) throw new Error(`O código de segurança (CVV) ${brand.name ? `da ${brand.name} ` : ''}tem ${brand.cvvLength} dígitos.`)
        if (holder.trim().length < 3) throw new Error('Informe o nome impresso no cartão.')
        const card = window.PagSeguro.encryptCard({ publicKey, holder: holder.trim(), number: cardDigits, expMonth: month, expYear: year, securityCode })
        if (card.hasErrors || !card.encryptedCard) throw new Error(card.errors?.[0]?.message ?? 'Confira os dados do cartão.')
        encryptedCard = card.encryptedCard
      }
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productSlug: product.slug, buyerName: name, buyerEmail: email, taxId: taxId.replace(/\D/g, ''), method, encryptedCard, installments: Number(installments) }) })
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Não foi possível iniciar o pagamento.'); setResult(data); if (data.status === 'PAID') setPaid(true)
    } catch (exception) { setError(exception instanceof Error ? exception.message : 'Não foi possível iniciar o pagamento.') } finally { setLoading(false) }
  }

  if (paid) return <div className="flex flex-col items-center gap-5 py-10 text-center"><div className="flex size-16 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300"><Check /></div><h2 className="text-2xl font-black text-white">Pagamento aprovado</h2><p className="max-w-sm text-sm leading-6 text-slate-300">Seu acesso foi liberado. Verifique o e-mail <strong className="text-white">{email}</strong>.</p><a href="/sign-in" className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-8 text-sm font-black text-[#04101d]">Entrar na plataforma</a></div>
  if (result) return <div className="flex flex-col items-center gap-6 py-6 text-center"><div className="flex size-14 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300"><ShieldCheck /></div><div><h2 className="text-2xl font-black text-white">{result.pix ? 'Pix gerado' : 'Pagamento enviado'}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{result.pix ? 'Pague pelo QR Code. Atualizaremos esta tela após a confirmação.' : 'Seu pagamento foi enviado para análise.'}</p></div>{result.pix && <div className="flex w-full flex-col items-center gap-4">{result.pix.imageUrl && <img src={result.pix.imageUrl} alt="QR Code para pagamento via Pix" className="size-52 rounded-xl bg-white p-2" />}<textarea readOnly value={result.pix.text} className="min-h-28 w-full resize-none rounded-xl border border-white/10 bg-[#050712] p-4 text-xs leading-5 text-slate-300" /><button type="button" onClick={() => { navigator.clipboard.writeText(result.pix!.text); setCopied(true); window.setTimeout(() => setCopied(false), 1800) }} className="inline-flex h-12 items-center gap-2 rounded-xl bg-cyan-300 px-6 text-sm font-black text-[#04101d]"><Copy /> {copied ? 'Código copiado' : 'Copiar código Pix'}</button></div>}<p className="text-xs text-slate-500">Pedido: {result.orderId}</p></div>
  return <form onSubmit={submit} className="flex flex-col gap-6"><div className="flex flex-col gap-3"><div><p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">Dados de acesso</p><p className="mt-2 text-sm text-slate-400">Você receberá as instruções neste e-mail.</p></div><div className="grid gap-3 sm:grid-cols-2"><input required value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" aria-label="Nome completo" className={`${inputClass} sm:col-span-2`} /><input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu melhor e-mail" aria-label="Seu melhor e-mail" className={inputClass} /><input required value={taxId} onChange={e => setTaxId(formatCpf(e.target.value))} placeholder="CPF (000.000.000-00)" aria-label="CPF" inputMode="numeric" autoComplete="off" maxLength={14} className={inputClass} /></div></div><div className="flex flex-col gap-3"><p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">Forma de pagamento</p><div className="grid grid-cols-2 gap-2 rounded-xl border border-white/[.08] bg-[#050712] p-1"><button type="button" onClick={() => setMethod('PIX')} className={`h-12 rounded-lg text-sm font-black ${method === 'PIX' ? 'bg-cyan-300 text-[#04101d]' : 'text-slate-400'}`}>Pix</button><button type="button" onClick={() => setMethod('CARD')} className={`h-12 rounded-lg text-sm font-black ${method === 'CARD' ? 'bg-cyan-300 text-[#04101d]' : 'text-slate-400'}`}>Cartão</button></div></div>{method === 'CARD' && <div className="grid gap-3"><input required value={holder} onChange={e => setHolder(e.target.value)} placeholder="Nome no cartão" aria-label="Nome no cartão" className={inputClass} /><div className="relative"><input required value={number} onChange={e => setNumber(formatCardNumber(e.target.value))} placeholder="Número do cartão" aria-label="Número do cartão" inputMode="numeric" autoComplete="cc-number" className={`${inputClass} w-full pr-32`} />{brand.name ? <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-cyan-400/15 px-2 py-1 text-[10px] font-black uppercase tracking-[.1em] text-cyan-300">{brand.name}</span> : brandUnknown ? <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-amber-400/15 px-2 py-1 text-[10px] font-black uppercase tracking-[.1em] text-amber-300">Bandeira não reconhecida</span> : null}<span aria-live="polite" className="sr-only">{brand.name ? `Cartão ${brand.name} detectado` : brandUnknown ? 'Bandeira não reconhecida' : ''}</span></div><div className="grid grid-cols-3 gap-3"><input required value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value, (e.nativeEvent as InputEvent).inputType?.startsWith('delete') ?? false))} placeholder="MM/AA" aria-label="Validade" inputMode="numeric" autoComplete="cc-exp" maxLength={7} className={inputClass} /><input required value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, brand.cvvLength))} placeholder={brand.cvvLength === 4 ? 'CVV (4 dígitos)' : 'CVV'} aria-label="Código de segurança do cartão" inputMode="numeric" autoComplete="cc-csc" maxLength={brand.cvvLength} className={inputClass} /><select value={installments} onChange={e => setInstallments(e.target.value)} aria-label="Parcelas" className={inputClass}><option value="1">1x</option><option value="2">2x</option><option value="3">3x</option><option value="6">6x</option><option value="12">12x</option></select></div></div>}{error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm leading-6 text-red-200">{error}</p>}<button disabled={loading} className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 text-base font-black text-[#04101d] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">{loading && <Loader2 className="animate-spin" />} {loading ? 'Processando pagamento...' : `Finalizar compra · ${brl(product.priceCents)}`}</button><p className="flex items-center justify-center gap-2 text-center text-xs leading-5 text-slate-500"><ShieldCheck /> Ambiente protegido pelo PagBank</p></form>
}
