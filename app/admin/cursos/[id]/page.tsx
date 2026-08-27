import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Package } from 'lucide-react'
import { platformProductById, lessonsByProductId, bundleCandidates } from '@/lib/learning-platform'
import { ProductForm } from '../product-form'
import { LessonManager } from '../lesson-manager'

export const metadata: Metadata = {
  title: 'Editar curso | Painel Admin',
}

export const dynamic = 'force-dynamic'

export default async function EditarCursoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const productId = Number(id)
  if (!Number.isFinite(productId)) notFound()

  const product = await platformProductById(productId)
  if (!product) notFound()

  const [lessons, candidates] = await Promise.all([
    lessonsByProductId(productId),
    bundleCandidates(productId),
  ])
  const includedCount = candidates.filter((candidate) => candidate.included === 1).length

  return (
    <div className="max-w-3xl space-y-8 text-white">
      <Link href="/admin/cursos" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-300">
        <ArrowLeft size={14} /> Voltar para cursos
      </Link>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Catálogo G‑LAB</p>
          <h1 className="mt-2 text-3xl font-black">{product.title}</h1>
        </div>
        <Link
          href={`/cursos/${product.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-300"
        >
          Ver página pública <ExternalLink size={13} />
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">Dados do curso</h2>
        <div className="rounded-3xl border border-white/10 bg-white/[.02] p-6">
          <ProductForm product={product} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">Combo de venda</h2>
        <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[.02] p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xs leading-relaxed text-slate-400">
            {includedCount > 0 ? (
              <>
                Este produto é um <strong className="text-slate-200">combo</strong> e libera {includedCount}{' '}
                {includedCount === 1 ? 'curso' : 'cursos'} na compra.
              </>
            ) : (
              <>
                Este é um curso avulso: a compra libera apenas ele. Para vender vários cursos em um só pagamento,
                monte um combo.
              </>
            )}
          </p>
          <Link
            href={includedCount > 0 ? `/admin/combos/${productId}` : '/admin/combos'}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-bold text-cyan-300 transition-colors hover:border-cyan-300/50 hover:text-cyan-200"
          >
            <Package size={14} />
            {includedCount > 0 ? 'Gerenciar combo' : 'Ir para combos'}
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">Aulas ({lessons.length})</h2>
        <LessonManager productId={productId} lessons={lessons} />
      </section>
    </div>
  )
}
