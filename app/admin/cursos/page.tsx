import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, CheckCircle2, CircleDashed, Plus, Settings2 } from 'lucide-react'
import { platformProducts } from '@/lib/learning-platform'

export const metadata: Metadata = {
  title: 'Cursos | Painel Admin',
  description: 'Gerenciar cursos',
}

export const dynamic = 'force-dynamic'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default async function CursosPage() {
  const products = await platformProducts()
  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Catálogo G‑LAB</p>
          <h1 className="mt-2 text-3xl font-black">Cursos e publicações</h1>
          <p className="mt-2 text-sm text-slate-400">Um curso só pode ir ao ar com preço, conteúdo e checkout conferidos.</p>
        </div>
        <Link href="/admin/cursos/novo" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition-opacity hover:opacity-90">
          <Plus size={16} /> Novo curso
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[.025] p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300"><BookOpen size={24} /></span>
          <h2 className="mt-5 text-xl font-black">Catálogo operacional vazio</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">Cadastre cada produto com preço oficial, imagem, conteúdo e regras de acesso.</p>
          <Link href="/cursos" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200">Ver catálogo público <Settings2 size={16} /></Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <div className="hidden grid-cols-[1fr_140px_130px_120px] gap-4 border-b border-white/10 bg-white/[.04] px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500 md:grid">
            <span>Formação</span><span>Preço</span><span>Status</span><span>Atualizado</span>
          </div>
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.isBundle ? `/admin/combos/${product.id}` : `/admin/cursos/${product.id}`}
              className="grid gap-3 border-b border-white/10 bg-[#0a0d19] px-6 py-5 transition-colors last:border-0 hover:bg-white/[.03] md:grid-cols-[1fr_140px_130px_120px] md:items-center"
            >
              <div>
                <p className="flex items-center gap-2 font-bold">
                  <span className="truncate">{product.title}</span>
                  {product.isBundle ? (
                    <span className="shrink-0 rounded bg-cyan-400/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                      Combo
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-slate-500">/{product.slug}</p>
              </div>
              <p className="text-sm font-bold">{money.format(product.priceCents / 100)}</p>
              <span className={product.isActive ? 'inline-flex w-fit items-center gap-2 text-xs font-bold text-emerald-300' : 'inline-flex w-fit items-center gap-2 text-xs font-bold text-amber-300'}>
                {product.isActive ? <CheckCircle2 size={15} /> : <CircleDashed size={15} />}
                {product.isActive ? 'Ativo' : 'Rascunho'}
              </span>
              <p className="text-xs text-slate-500">{new Intl.DateTimeFormat('pt-BR').format(new Date(product.updatedAt))}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
