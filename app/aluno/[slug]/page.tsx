import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Award, CheckCircle2, FileText, PlayCircle } from 'lucide-react'
import { currentPlatformUser, courseForStudent, lessonsWithProgress } from '@/lib/learning-platform'

export const dynamic = 'force-dynamic'

export default async function CursoAlunoPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await currentPlatformUser()
  if (!user) redirect('/sign-in')

  const slug = (await params).slug
  const course = await courseForStudent(slug, user.email)
  if (!course) notFound()

  const lessons = await lessonsWithProgress(course.id, course.enrollmentId)
  const completed = lessons.filter((lesson) => lesson.completedAt).length
  const allCompleted = lessons.length > 0 && completed === lessons.length
  const nextLesson = lessons.find((lesson) => !lesson.completedAt) ?? lessons[0]

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <Link href="/aluno" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-cyan-200">
        <ArrowLeft size={15} /> Minha biblioteca
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_.52fr]">
        <section>
          <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Formação G‑LAB</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-.04em] md:text-5xl">{course.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{course.description}</p>

          <div className="mt-9 overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0d19]">
            <div className="flex aspect-video items-center justify-center bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,.22),transparent_45%),linear-gradient(135deg,#101b35,#090b15)]">
              {nextLesson ? (
                <Link
                  href={`/aluno/${course.slug}/aulas/${nextLesson.id}`}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-300 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,.45)] transition hover:scale-105"
                  aria-label={completed > 0 ? 'Continuar aula' : 'Começar curso'}
                >
                  <PlayCircle size={31} />
                </Link>
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-300 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,.45)]">
                  <PlayCircle size={31} />
                </span>
              )}
            </div>
            <div className="p-6">
              <h2 className="font-black">Aulas e materiais</h2>
              <p className="mt-2 text-sm text-slate-400">Selecione uma aula abaixo. Materiais protegidos serão liberados somente pela plataforma.</p>
              {nextLesson ? (
                <Link
                  href={`/aluno/${course.slug}/aulas/${nextLesson.id}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-black text-slate-950"
                >
                  <PlayCircle size={16} /> {completed > 0 ? 'Continuar de onde parei' : 'Começar agora'}
                </Link>
              ) : null}
            </div>
          </div>

          {allCompleted ? (
            <div className="mt-6 flex flex-col items-start gap-3 rounded-[26px] border border-emerald-400/25 bg-emerald-400/10 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-300">
                  <Award size={22} />
                </span>
                <div>
                  <p className="font-black text-emerald-200">Formação concluída!</p>
                  <p className="text-sm text-emerald-200/80">Você completou todas as aulas. Emita seu certificado.</p>
                </div>
              </div>
              <a
                href={`/aluno/${course.slug}/certificado`}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-300 px-5 py-2.5 text-sm font-black text-slate-950"
              >
                Emitir certificado
              </a>
            </div>
          ) : null}
        </section>

        <aside className="h-fit rounded-[26px] border border-white/10 bg-white/[.025] p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-black">Seu progresso</h2>
            <span className="text-xs font-bold text-cyan-300">
              {completed}/{lessons.length}
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
              style={{ width: `${lessons.length ? Math.round((completed / lessons.length) * 100) : 0}%` }}
            />
          </div>
          <div className="mt-7 space-y-3">
            {lessons.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-slate-400">
                O material desta formação está sendo organizado pela equipe G‑LAB.
              </p>
            ) : (
              lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/aluno/${course.slug}/aulas/${lesson.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#090c16] p-4 transition hover:border-cyan-400/40"
                >
                  <span className={lesson.completedAt ? 'text-emerald-400' : 'text-cyan-300'}>
                    {lesson.completedAt ? <CheckCircle2 size={18} /> : lesson.lessonType === 'PDF' ? <FileText size={18} /> : <PlayCircle size={18} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Aula {String(lesson.position).padStart(2, '0')}</p>
                    <p className="truncate text-sm font-bold">{lesson.title}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
