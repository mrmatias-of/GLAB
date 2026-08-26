'use client'

import { useActionState, useState } from 'react'
import { createLessonAction, updateLessonAction, type LessonActionState } from './actions'
import { LessonFileUpload } from './lesson-file-upload'

type Lesson = {
  id: number
  title: string
  lessonType: string
  contentUrl: string | null
  isPreview: number
  isActive: number
}

const initialState: LessonActionState = {}

export function LessonForm({
  productId,
  lesson,
  onDone,
}: {
  productId: number
  lesson?: Lesson
  onDone?: () => void
}) {
  const action = lesson
    ? updateLessonAction.bind(null, productId, lesson.id)
    : createLessonAction.bind(null, productId)
  const [state, formAction, pending] = useActionState(action, initialState)
  const [lessonType, setLessonType] = useState(lesson?.lessonType ?? 'VIDEO')

  return (
    <form
      action={async (formData) => {
        await formAction(formData)
        onDone?.()
      }}
      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[.02] p-4"
    >
      {state?.error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs font-medium text-red-300">{state.error}</div>
      ) : null}

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        Título da aula
        <input
          name="title"
          required
          defaultValue={lesson?.title}
          placeholder="Ex: Aula 1 - Introdução"
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 focus:border-cyan-300/50 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
        Tipo de conteúdo
        <select
          name="lessonType"
          value={lessonType}
          onChange={(e) => setLessonType(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white focus:border-cyan-300/50 focus:outline-none"
        >
          <option value="VIDEO">Vídeo</option>
          <option value="PDF">PDF</option>
          <option value="TEXT">Texto</option>
        </select>
      </label>

      {lessonType === 'VIDEO' || lessonType === 'PDF' ? (
        <div className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
          Arquivo da aula
          <LessonFileUpload
            name="contentUrl"
            defaultValue={lesson?.contentUrl}
            accept={lessonType === 'PDF' ? 'application/pdf' : 'video/*'}
          />
        </div>
      ) : (
        <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-400">
          Conteúdo (texto/URL)
          <textarea
            name="contentUrl"
            rows={3}
            defaultValue={lesson?.contentUrl ?? ''}
            className="rounded-xl border border-white/10 bg-[#0a0d19] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 focus:border-cyan-300/50 focus:outline-none"
          />
        </label>
      )}

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <input
            name="isPreview"
            type="checkbox"
            defaultChecked={lesson ? lesson.isPreview === 1 : false}
            className="h-4 w-4 rounded border-white/20 bg-[#0a0d19] accent-cyan-400"
          />
          Preview grátis
        </label>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={lesson ? lesson.isActive === 1 : true}
            className="h-4 w-4 rounded border-white/20 bg-[#0a0d19] accent-cyan-400"
          />
          Aula ativa
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-xl bg-cyan-400 px-4 py-2 text-xs font-black text-[#050810] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? 'Salvando...' : lesson ? 'Salvar aula' : 'Adicionar aula'}
      </button>
    </form>
  )
}
