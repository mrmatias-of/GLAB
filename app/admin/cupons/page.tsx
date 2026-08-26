import { Metadata } from 'next'
import { Ticket } from 'lucide-react'
import { platformCoupons, platformProducts } from '@/lib/learning-platform'
import { CouponForm } from './coupon-form'
import { CouponToggle } from './coupon-toggle'

export const metadata: Metadata = {
  title: 'Cupons | Painel Admin',
  description: 'Descontos e campanhas promocionais',
}

export const dynamic = 'force-dynamic'

const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })

function discountLabel(type: string, value: number) {
  return type === 'FIXED' ? `R$ ${(value / 100).toFixed(2).replace('.', ',')}` : `${value}%`
}

export default async function CuponsPage() {
  const [coupons, products] = await Promise.all([platformCoupons(), platformProducts()])

  return (
    <div className="space-y-8 text-white">
      <div>
        <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Promoções</p>
        <h1 className="mt-2 text-3xl font-black">Cupons</h1>
        <p className="mt-2 text-sm text-slate-400">Crie códigos de desconto para campanhas específicas ou para todo o catálogo.</p>
      </div>

      <CouponForm products={products.map((p) => ({ id: p.id, title: p.title }))} />

      {coupons.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[.025] p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <Ticket size={24} />
          </span>
          <h2 className="mt-5 text-xl font-black">Nenhum cupom criado ainda</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">Use o formulário acima para criar o primeiro código de desconto.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10">
          <div className="hidden grid-cols-[130px_1fr_110px_120px_110px_120px] gap-4 border-b border-white/10 bg-white/[.04] px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 md:grid">
            <span>Código</span>
            <span>Curso</span>
            <span>Desconto</span>
            <span>Usos</span>
            <span>Expira</span>
            <span>Status</span>
          </div>
          {coupons.map((coupon) => (
            <div key={coupon.id} className="grid gap-2 border-b border-white/10 bg-[#0a0d19] px-6 py-5 last:border-0 md:grid-cols-[130px_1fr_110px_120px_110px_120px] md:items-center">
              <p className="font-mono font-bold text-cyan-300">{coupon.code}</p>
              <div>
                <p className="font-bold">{coupon.productTitle ?? 'Todos os cursos'}</p>
                {coupon.description ? <p className="mt-1 text-xs text-slate-500">{coupon.description}</p> : null}
              </div>
              <p className="text-sm font-bold">{discountLabel(coupon.discountType, coupon.discountValue)}</p>
              <p className="text-sm text-slate-400">
                {coupon.redeemedCount}
                {coupon.maxRedemptions ? ` / ${coupon.maxRedemptions}` : ''}
              </p>
              <p className="text-xs text-slate-500">{coupon.expiresAt ? date.format(new Date(coupon.expiresAt)) : 'Sem prazo'}</p>
              <CouponToggle id={coupon.id} isActive={Boolean(coupon.isActive)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
