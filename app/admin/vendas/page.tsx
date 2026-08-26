import { Metadata } from 'next'
import { TrendingUp, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { platformOrders, platformSalesSummary } from '@/lib/learning-platform'

export const metadata: Metadata = {
  title: 'Vendas | Painel Admin',
  description: 'Pedidos, receita e status de pagamento',
}

export const dynamic = 'force-dynamic'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

const statusMeta: Record<string, { label: string; icon: typeof CheckCircle2; className: string }> = {
  PAID: { label: 'Pago', icon: CheckCircle2, className: 'text-emerald-300' },
  PENDING: { label: 'Pendente', icon: Clock, className: 'text-amber-300' },
  CANCELED: { label: 'Cancelado', icon: XCircle, className: 'text-red-300' },
}

export default async function VendasPage() {
  const [orders, summary] = await Promise.all([platformOrders(), platformSalesSummary()])

  const stats = [
    { label: 'Receita confirmada', value: money.format(summary.revenueCents / 100) },
    { label: 'Pedidos pagos', value: summary.paidOrders },
    { label: 'Pedidos pendentes', value: summary.pendingOrders },
    { label: 'Pedidos cancelados', value: summary.canceledOrders },
  ]

  return (
    <div className="space-y-8 text-white">
      <div>
        <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Financeiro</p>
        <h1 className="mt-2 text-3xl font-black">Vendas</h1>
        <p className="mt-2 text-sm text-slate-400">Pedidos processados pelo checkout, com status de pagamento em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[.025] p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <TrendingUp size={24} />
          </span>
          <h2 className="mt-5 text-xl font-black">Nenhum pedido ainda</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">Os pedidos aparecem aqui assim que o checkout de um curso for concluído.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10">
          <div className="hidden grid-cols-[1.2fr_1.2fr_120px_110px_160px] gap-4 border-b border-white/10 bg-white/[.04] px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 md:grid">
            <span>Comprador</span>
            <span>Curso</span>
            <span>Valor</span>
            <span>Status</span>
            <span>Data</span>
          </div>
          {orders.map((order) => {
            const meta = statusMeta[order.status] ?? { label: order.status, icon: Clock, className: 'text-slate-400' }
            const Icon = meta.icon
            return (
              <div key={order.id} className="grid gap-2 border-b border-white/10 bg-[#0a0d19] px-6 py-5 last:border-0 md:grid-cols-[1.2fr_1.2fr_120px_110px_160px] md:items-center">
                <div>
                  <p className="font-bold">{order.buyerName}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{order.buyerEmail}</p>
                </div>
                <p className="font-bold">{order.productTitle}</p>
                <p className="text-sm font-bold">{money.format(order.amountCents / 100)}</p>
                <span className={`inline-flex w-fit items-center gap-2 text-xs font-bold ${meta.className}`}>
                  <Icon size={15} />
                  {meta.label}
                </span>
                <p className="text-xs text-slate-500">{date.format(new Date(order.createdAt))}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
