import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProductForm } from '../product-form'

export const metadata: Metadata = {
  title: 'Novo curso | Painel Admin',
  description: 'Criar novo curso',
}

export default function NovoCursoPage() {
  return (
    <div className="max-w-2xl space-y-6 text-white">
      <Link href="/admin/cursos" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-300">
        <ArrowLeft size={14} /> Voltar para cursos
      </Link>

      <div>
        <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Catálogo G‑LAB</p>
        <h1 className="mt-2 text-3xl font-black">Novo curso</h1>
        <p className="mt-2 text-sm text-slate-400">Depois de criar, você poderá cadastrar as aulas do curso.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[.02] p-6">
        <ProductForm />
      </div>
    </div>
  )
}
