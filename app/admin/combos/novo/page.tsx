import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { bundleCandidates } from '@/lib/learning-platform'
import { ComboForm } from '../combo-form'

export const metadata: Metadata = {
  title: 'Novo combo | Painel Admin',
  description: 'Criar combo de venda',
}

export const dynamic = 'force-dynamic'

export default async function NovoComboPage() {
  const candidates = await bundleCandidates()

  return (
    <div className="space-y-6 text-white">
      <Link href="/admin/combos" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-300">
        <ArrowLeft size={14} /> Voltar para combos
      </Link>

      <div>
        <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Catálogo G·LAB</p>
        <h1 className="mt-2 text-3xl font-black">Novo combo</h1>
        <p className="mt-2 text-sm text-slate-400">
          Escolha os cursos, defina o preço e publique. O combo fica pronto para venda em um só passo.
        </p>
      </div>

      <ComboForm candidates={candidates} />
    </div>
  )
}
