import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, CircleDashed, Package, Plus } from 'lucide-react'
import { platformBundles } from '@/lib/learning-platform'

export const metadata: Metadata = {
  title: 'Combos | Painel Admin',
  description: 'Criar e gerenciar combos de venda',
}

export const dynamic = 'force-dynamic'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default async function CombosPage() {
  const bundles = await platformBundles()

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Catálogo G·LAB</p>
          <h1 className="mt-2 text-3xl font-black">Combos de venda</h1>
          <p className="mt-2 text-sm text-slate-400">
            Um combo vende vários cursos em um só pagamento. Ao pagar, o aluno recebe acesso a todos eles.
          </p>
        </div>
        <Link
          href="/admin/combos/novo"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition-opacity hover:opacity-90"
        >
          <Plus size={16} /> Novo combo
        </Link>
      </div>

      {bundles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[.025] p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <Package size={24} />
          </span>
          <h2 className="mt-5 text-xl font-black">Nenhum combo criado</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Monte um combo escolhendo os cursos que ele libera e o preço promocional. Tudo em uma única tela.
          </p>
          <Link
            href="/admin/combos/novo"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200"
          >
            Criar primeiro combo <Plus size={16} />
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <div className="hidden grid-cols-[1fr_110px_130px_130px_120px] gap-4 border-b border-white/10 bg-white/[.04] px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 md:grid">
            <span>Combo</span>
            <span>Cursos</span>
            <span>Preço</span>
            <span>Economia</span>
            <span>Status</span>
          </div>
          {bundles.map((bundle) => {
            const partsCents = Number(bundle.partsCents)
            const savedCents = partsCents - bundle.priceCents
            return (
              <Link
                key={bundle.id}
                href={`/admin/combos/${bundle.id}`}
                className="grid gap-3 border-b border-white/10 bg-[#0a0d19] px-6 py-5 transition-colors last:border-0 hover:bg-white/[.03] md:grid-cols-[1fr_110px_130px_130px_120px] md:items-center"
              >
                <div>
                  <p className="font-bold">{bundle.title}</p>
                  <p className="mt-1 text-xs text-slate-500">/{bundle.slug}</p>
                </div>
                <p className="text-sm font-bold">
                  {bundle.itemCount}
                  <span className="ml-1 text-xs font-medium text-slate-500">
                    {bundle.itemCount === 1 ? 'curso' : 'cursos'}
                  </span>
                </p>
                <p className="text-sm font-bold">{money.format(bundle.priceCents / 100)}</p>
                <p className={savedCents > 0 ? 'text-sm font-bold text-emerald-300' : 'text-sm font-bold text-slate-500'}>
                  {savedCents > 0 ? money.format(savedCents / 100) : '—'}
                </p>
                <span
                  className={
                    bundle.isActive
                      ? 'inline-flex w-fit items-center gap-2 text-xs font-bold text-emerald-300'
                      : 'inline-flex w-fit items-center gap-2 text-xs font-bold text-amber-300'
                  }
                >
                  {bundle.isActive ? <CheckCircle2 size={15} /> : <CircleDashed size={15} />}
                  {bundle.isActive ? 'À venda' : 'Rascunho'}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
