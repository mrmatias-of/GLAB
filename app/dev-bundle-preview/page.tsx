// PÁGINA TEMPORÁRIA DE VERIFICAÇÃO VISUAL — será removida após o teste.
import { bundleCandidates } from '@/lib/learning-platform'
import { BundleManager } from '../admin/cursos/bundle-manager'

export const dynamic = 'force-dynamic'

export default async function DevBundlePreview() {
  const candidates = await bundleCandidates(1)
  const includedCount = candidates.filter((candidate) => candidate.included === 1).length

  return (
    <div className="min-h-screen bg-[#050810] p-6">
      <div className="mx-auto max-w-3xl space-y-4 text-white">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">
          Cursos liberados na compra ({includedCount})
        </h2>
        <BundleManager productId={1} candidates={candidates} />
      </div>
    </div>
  )
}
