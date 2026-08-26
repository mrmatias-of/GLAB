'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { markLessonCompleteAction } from './actions'

export function CompleteLessonButton({ slug, lessonId, completed }: { slug: string; lessonId: number; completed: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  if (completed) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-5 py-2.5 text-sm font-black text-emerald-300">
        <CheckCircle2 size={16} /> Aula concluída
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null)
          startTransition(async () => {
            try {
              await markLessonCompleteAction(slug, lessonId)
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Não foi possível concluir a aula.')
            }
          })
        }}
        className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-black text-slate-950 transition-opacity disabled:opacity-60"
      >
        <CheckCircle2 size={16} />
        {isPending ? 'Salvando...' : 'Marcar como concluída'}
      </button>
      {error ? <p className="text-xs font-medium text-red-300">{error}</p> : null}
    </div>
  )
}
