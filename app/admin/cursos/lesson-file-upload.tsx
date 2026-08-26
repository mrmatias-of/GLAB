'use client'

import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import { UploadCloud, CheckCircle2, Loader2 } from 'lucide-react'

type Props = {
  name: string
  defaultValue?: string | null
  accept?: string
}

export function LessonFileUpload({ name, defaultValue, accept = 'video/*,application/pdf' }: Props) {
  const [url, setUrl] = useState(defaultValue ?? '')
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setProgress(0)

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/lesson-upload',
        multipart: true,
        onUploadProgress: (event) => setProgress(Math.round(event.percentage)),
      })
      setUrl(blob.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no upload do arquivo.')
    } finally {
      setProgress(null)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-3 py-2.5 text-xs font-bold text-slate-300 transition-colors hover:border-cyan-300/40 hover:text-cyan-300"
        >
          {progress !== null ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
          {progress !== null ? `Enviando... ${progress}%` : 'Enviar arquivo'}
        </button>
        {url ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <CheckCircle2 size={14} />
            Arquivo enviado
          </span>
        ) : (
          <span className="text-xs text-slate-500">Vídeo (mp4/webm/mov) ou PDF, até 2GB</span>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="truncate text-[11px] text-slate-500 hover:text-cyan-300">
          {url}
        </a>
      ) : null}
      {error ? <p className="text-xs font-medium text-red-400">{error}</p> : null}
    </div>
  )
}
