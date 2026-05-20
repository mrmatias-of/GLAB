import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, Play, CheckCircle, Lock, FileText, Clock } from "lucide-react"
import LessonPlayer from "@/components/aluno/lesson-player"

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ aula?: string }>
}

export default async function CursoAlunoPage({ params, searchParams }: Props) {
  const { id: cursoId } = await params
  const { aula: aulaId } = await searchParams
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login?next=/aluno/cursos/" + cursoId)

  // Verificar se usuário tem acesso ao curso
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("curso_id", cursoId)
    .eq("status", "approved")
    .single()

  if (!purchase) {
    redirect("/cursos?error=no_access")
  }

  // Buscar curso
  const { data: curso } = await supabase
    .from("cursos")
    .select("id, titulo, descricao, slug")
    .eq("id", cursoId)
    .single()

  if (!curso) notFound()

  // Buscar módulos com aulas
  const { data: modules } = await supabase
    .from("modules")
    .select(`
      id,
      titulo,
      ordem,
      lessons (
        id,
        titulo,
        descricao,
        duracao_minutos,
        video_url,
        pdf_path,
        conteudo,
        ordem,
        is_free
      )
    `)
    .eq("curso_id", cursoId)
    .order("ordem", { ascending: true })

  // Buscar progresso do aluno
  const { data: progressData } = await supabase
    .from("progress")
    .select("lesson_id, completed, progress_percent")
    .eq("user_id", user.id)
    .eq("curso_id", cursoId)

  const progressMap = new Map(
    (progressData || []).map(p => [p.lesson_id, p])
  )

  // Aula atual selecionada
  let currentLesson = null
  let currentModule = null

  if (aulaId) {
    for (const mod of modules || []) {
      const lesson = (mod.lessons as any[])?.find((l: any) => l.id === aulaId)
      if (lesson) {
        currentLesson = lesson
        currentModule = mod
        break
      }
    }
  }

  // Se não tem aula selecionada, pegar a primeira não completada
  if (!currentLesson && modules && modules.length > 0) {
    for (const mod of modules) {
      const lessons = (mod.lessons as any[]) || []
      for (const lesson of lessons.sort((a: any, b: any) => a.ordem - b.ordem)) {
        const progress = progressMap.get(lesson.id)
        if (!progress?.completed) {
          currentLesson = lesson
          currentModule = mod
          break
        }
      }
      if (currentLesson) break
    }
    
    // Se todas completadas, pegar a primeira
    if (!currentLesson && modules[0]?.lessons) {
      const firstMod = modules[0]
      currentLesson = (firstMod.lessons as any[])?.[0]
      currentModule = firstMod
    }
  }

  // Calcular estatísticas
  const allLessons = (modules || []).flatMap(m => (m.lessons as any[]) || [])
  const completedCount = allLessons.filter(l => progressMap.get(l.id)?.completed).length
  const totalCount = allLessons.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar com módulos */}
      <aside className="w-80 border-r border-border flex flex-col bg-surface">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <Link 
            href="/aluno" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
          <h1 className="font-bold text-foreground line-clamp-2">{curso.titulo}</h1>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>{completedCount}/{totalCount} aulas</span>
            <span className="text-cyan">{progressPercent}%</span>
          </div>
          <div className="mt-2 h-1 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan transition-all" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>

        {/* Lista de módulos */}
        <div className="flex-1 overflow-auto">
          {(modules || []).map((mod, modIndex) => (
            <div key={mod.id} className="border-b border-border">
              <div className="px-4 py-3 bg-background/50">
                <span className="text-[10px] font-bold text-cyan uppercase tracking-wider">
                  Módulo {modIndex + 1}
                </span>
                <h3 className="text-sm font-semibold text-foreground mt-1">{mod.titulo}</h3>
              </div>
              
              <div className="py-1">
                {((mod.lessons as any[]) || [])
                  .sort((a: any, b: any) => a.ordem - b.ordem)
                  .map((lesson: any, lessonIndex: number) => {
                    const progress = progressMap.get(lesson.id)
                    const isCompleted = progress?.completed
                    const isActive = currentLesson?.id === lesson.id

                    return (
                      <Link
                        key={lesson.id}
                        href={`/aluno/cursos/${cursoId}?aula=${lesson.id}`}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                          isActive 
                            ? "bg-cyan/10 text-cyan border-l-2 border-cyan" 
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isCompleted 
                            ? "bg-green-500 text-white" 
                            : "bg-surface border border-border text-muted-foreground"
                        }`}>
                          {isCompleted ? <CheckCircle size={12} /> : lessonIndex + 1}
                        </span>
                        <span className="flex-1 line-clamp-1">{lesson.titulo}</span>
                        {lesson.duracao_minutos > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            {lesson.duracao_minutos}min
                          </span>
                        )}
                      </Link>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentLesson ? (
          <LessonPlayer 
            lesson={currentLesson}
            cursoId={cursoId}
            userId={user.id}
            isCompleted={progressMap.get(currentLesson.id)?.completed || false}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BookOpen size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Nenhuma aula disponível</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
