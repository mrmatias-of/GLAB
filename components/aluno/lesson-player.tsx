"use client"

import { useState, useCallback, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, FileText, Download, Play, Pause } from "lucide-react"
import DOMPurify from "dompurify"

type Lesson = {
  id: string
  titulo: string
  descricao: string | null
  video_url: string | null
  pdf_path: string | null
  conteudo: string | null
  duracao_minutos: number
}

type Props = {
  lesson: Lesson
  cursoId: string
  userId: string
  isCompleted: boolean
}

export default function LessonPlayer({ lesson, cursoId, userId, isCompleted: initialCompleted }: Props) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  const [marking, setMarking] = useState(false)

  const markAsCompleted = useCallback(async () => {
    if (marking || isCompleted) return
    setMarking(true)

    const supabase = createClient()
    
    await supabase.from("progress").upsert({
      user_id: userId,
      lesson_id: lesson.id,
      curso_id: cursoId,
      completed: true,
      progress_percent: 100,
      completed_at: new Date().toISOString()
    }, {
      onConflict: "user_id,lesson_id"
    })

    setIsCompleted(true)
    setMarking(false)
  }, [lesson.id, cursoId, userId, marking, isCompleted])

  const handleDownloadPdf = async () => {
    if (!lesson.pdf_path) return
    
    const supabase = createClient()
    
    // Gerar URL assinada
    const { data } = await supabase.storage
      .from("courses-private")
      .createSignedUrl(lesson.pdf_path, 60) // 60 segundos

    if (data?.signedUrl) {
      // Registrar download
      await supabase.from("downloads").insert({
        user_id: userId,
        lesson_id: lesson.id,
        curso_id: cursoId,
        file_path: lesson.pdf_path
      })

      window.open(data.signedUrl, "_blank")
    }
  }

  // Sanitizar HTML para prevenir XSS
  const sanitizedContent = useMemo(() => {
    if (!lesson.conteudo) return null
    return DOMPurify.sanitize(lesson.conteudo, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel'],
      ALLOW_DATA_ATTR: false
    })
  }, [lesson.conteudo])

  return (
    <div className="flex-1 flex flex-col">
      {/* Video area */}
      {lesson.video_url ? (
        <div className="aspect-video bg-black relative">
          <iframe
            src={lesson.video_url}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video bg-surface flex items-center justify-center">
          <div className="text-center">
            <FileText size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Esta aula nao possui video</p>
          </div>
        </div>
      )}

      {/* Lesson info */}
      <div className="flex-1 overflow-auto p-6 md:p-10">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-black text-foreground mb-2">{lesson.titulo}</h1>
              {lesson.descricao && (
                <p className="text-muted-foreground">{lesson.descricao}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {lesson.pdf_path && (
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-surface text-sm font-medium text-foreground hover:border-cyan/30 hover:text-cyan transition-all"
                >
                  <Download size={16} />
                  PDF
                </button>
              )}

              <button
                onClick={markAsCompleted}
                disabled={isCompleted || marking}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isCompleted
                    ? "bg-green-500/10 text-green-500 border border-green-500/30"
                    : "bg-cyan text-background hover:bg-cyan/90"
                }`}
              >
                <CheckCircle size={16} />
                {isCompleted ? "Concluida" : marking ? "Salvando..." : "Marcar como concluida"}
              </button>
            </div>
          </div>

          {/* Content - sanitizado com DOMPurify */}
          {sanitizedContent && (
            <div 
              className="prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
