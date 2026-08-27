import { bundleCandidates } from '@/lib/learning-platform'
import { ComboForm } from '../admin/combos/combo-form'

export const dynamic = 'force-dynamic'

export default async function DevComboPreview() {
  const candidates = await bundleCandidates()
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-7xl">
        <ComboForm candidates={candidates} />
      </div>
    </div>
  )
}
