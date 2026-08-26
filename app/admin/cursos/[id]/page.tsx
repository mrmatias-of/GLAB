import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { platformProductById, lessonsByProductId } from '@/lib/learning-platform'
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

  const lessons = await lessonsByProductId(productId)

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
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">Aulas ({lessons.length})</h2>
        <LessonManager productId={productId} lessons={lessons} />
      </section>
    </div>
  )
}
