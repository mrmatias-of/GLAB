'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, Pencil, Trash2, Video, FileText, Type, Plus } from 'lucide-react'
import { LessonForm } from './lesson-form'
import { deleteLessonAction, reorderLessonAction } from './actions'

type Lesson = {
  id: number
  productId: number
  title: string
  lessonType: string
  contentUrl: string | null
  position: number
  isPreview: number
  isActive: number
}

const typeIcon = { VIDEO: Video, PDF: FileText, TEXT: Type } as const

export function LessonManager({ productId, lessons }: { productId: number; lessons: Lesson[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      {lessons.length === 0 && !creating ? (
        <p className="rounded-2xl border border-white/10 bg-white/[.02] p-6 text-center text-sm text-slate-500">
          Nenhuma aula cadastrada ainda.
        </p>
      ) : null}

      {lessons.map((lesson, index) => {
        const Icon = typeIcon[lesson.lessonType as keyof typeof typeIcon] ?? Video

        if (editingId === lesson.id) {
          return (
            <LessonForm key={lesson.id} productId={productId} lesson={lesson} onDone={() => setEditingId(null)} />
          )
        }

        return (
          <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[.02] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-cyan-300">
                <Icon size={16} />
              </span>
              <div>
                <p className="text-sm font-bold text-white">{lesson.title}</p>
                <p className="mt-0.5 flex gap-2 text-[11px] text-slate-500">
                  {lesson.isPreview ? <span className="text-emerald-400">Preview grátis</span> : null}
                  {!lesson.isActive ? <span className="text-amber-400">Inativa</span> : null}
                  {!lesson.contentUrl ? <span className="text-red-400">Sem conteúdo</span> : null}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => reorderLessonAction(productId, lesson.id, 'up')}
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
                aria-label="Mover para cima"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                disabled={index === lessons.length - 1}
                onClick={() => reorderLessonAction(productId, lesson.id, 'down')}
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
                aria-label="Mover para baixo"
              >
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                onClick={() => setEditingId(lesson.id)}
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-cyan-300"
                aria-label="Editar aula"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Excluir a aula "${lesson.title}"? Esta ação não pode ser desfeita.`)) {
                    deleteLessonAction(productId, lesson.id)
                  }
                }}
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-red-400"
                aria-label="Excluir aula"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )
      })}

      {creating ? (
        <LessonForm productId={productId} onDone={() => setCreating(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 p-4 text-sm font-bold text-slate-400 transition-colors hover:border-cyan-300/40 hover:text-cyan-300"
        >
          <Plus size={16} />
          Adicionar aula
        </button>
      )}
    </div>
  )
}
