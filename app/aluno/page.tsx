import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BookOpen, Play, CheckCircle, Clock } from "lucide-react"

export default async function AlunoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Buscar cursos comprados com progresso
  const { data: purchases } = await supabase
    .from("purchases")
    .select(`
      id,
      status,
      purchased_at,
      cursos (
        id,
        titulo,
        slug,
        descricao,
        thumbnail_url,
        total_aulas,
        duracao_total_minutos
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "approved")
    .order("purchased_at", { ascending: false })

  // Buscar progresso de cada curso
  const cursosComProgresso = await Promise.all(
    (purchases || []).map(async (purchase) => {
      const curso = purchase.cursos as {
        id: string
        titulo: string
        slug: string
        descricao: string
        thumbnail_url: string | null
        total_aulas: number
        duracao_total_minutos: number
      }

      if (!curso) return null

      // Contar aulas completas
      const { count: completedLessons } = await supabase
        .from("progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("curso_id", curso.id)
        .eq("completed", true)

      const totalAulas = curso.total_aulas || 0
      const progressPercent = totalAulas > 0 
        ? Math.round(((completedLessons || 0) / totalAulas) * 100)
        : 0

      return {
        ...curso,
        completedLessons: completedLessons || 0,
        progressPercent,
        purchasedAt: purchase.purchased_at
      }
    })
  )

  const cursos = cursosComProgresso.filter(Boolean)

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground mb-2">Meus Cursos</h1>
        <p className="text-muted-foreground text-sm">
          Continue de onde parou ou explore novos conteúdos
        </p>
      </div>

      {/* Lista de cursos */}
      {cursos.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">
            Nenhum curso encontrado
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Você ainda não possui cursos. Explore nosso catálogo!
          </p>
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 bg-cyan text-background font-bold text-sm px-6 py-3 rounded-xl hover:bg-cyan/90 transition-all"
          >
            Ver Cursos
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map((curso) => (
            <Link
              key={curso!.id}
              href={`/aluno/cursos/${curso!.id}`}
              className="group rounded-2xl border border-border bg-card hover:border-cyan/30 hover:shadow-[0_0_30px_rgba(0,212,200,0.08)] transition-all duration-300 overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-surface relative">
                {curso!.thumbnail_url ? (
                  <img 
                    src={curso!.thumbnail_url} 
                    alt={curso!.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={40} className="text-muted-foreground/20" />
                  </div>
                )}
                
                {/* Play overlay */}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-cyan flex items-center justify-center">
                    <Play size={24} className="text-background ml-1" />
                  </div>
                </div>

                {/* Progress badge */}
                {curso!.progressPercent === 100 ? (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle size={12} />
                    Concluído
                  </div>
                ) : curso!.progressPercent > 0 ? (
                  <div className="absolute top-3 right-3 bg-cyan text-background text-[10px] font-bold px-2 py-1 rounded-full">
                    {curso!.progressPercent}%
                  </div>
                ) : null}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-foreground mb-2 group-hover:text-cyan transition-colors line-clamp-2">
                  {curso!.titulo}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {curso!.descricao}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen size={12} />
                    {curso!.completedLessons}/{curso!.total_aulas || 0} aulas
                  </span>
                  {curso!.duracao_total_minutos > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {Math.round(curso!.duracao_total_minutos / 60)}h
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-1.5 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan rounded-full transition-all duration-500"
                    style={{ width: `${curso!.progressPercent}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
