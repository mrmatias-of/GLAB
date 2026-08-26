import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, FileText, PlayCircle } from 'lucide-react'
import { currentPlatformUser, courseForStudent, lessonsWithProgress } from '@/lib/learning-platform'
import { CompleteLessonButton } from '../complete-lesson-button'

export const dynamic = 'force-dynamic'

export default async function LessonPlayerPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const user = await currentPlatformUser()
  if (!user) redirect('/sign-in')

  const { slug, lessonId: lessonIdRaw } = await params
  const lessonId = Number(lessonIdRaw)
  if (!Number.isFinite(lessonId)) notFound()

  const course = await courseForStudent(slug, user.email)
  if (!course) notFound()

  const lessons = await lessonsWithProgress(course.id, course.enrollmentId)
  const index = lessons.findIndex((item) => item.id === lessonId)
  if (index === -1) notFound()

  const lesson = lessons[index]
  const previousLesson = lessons[index - 1] ?? null
  const nextLesson = lessons[index + 1] ?? null
  const completed = lessons.filter((item) => item.completedAt).length
  const allCompleted = lessons.length > 0 && completed === lessons.length

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <Link href={`/aluno/${course.slug}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-cyan-200">
        <ArrowLeft size={15} /> {course.title}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_.42fr]">
        <section>
          <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Aula {String(lesson.position).padStart(2, '0')}</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-.03em] md:text-4xl">{lesson.title}</h1>

          <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0d19]">
            {lesson.lessonType === 'VIDEO' && lesson.contentUrl ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video key={lesson.id} controls className="aspect-video w-full bg-black" src={lesson.contentUrl}>
                Seu navegador não suporta reprodução de vídeo.
              </video>
            ) : lesson.lessonType === 'PDF' && lesson.contentUrl ? (
              <div className="flex aspect-video flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,.18),transparent_45%),linear-gradient(135deg,#101b35,#090b15)] p-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                  <FileText size={24} />
                </span>
                <p className="max-w-sm text-sm text-slate-300">Este material é um PDF. Abra em uma nova aba para ler ou baixar.</p>
                <a
                  href={lesson.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-black text-slate-950"
                >
                  <FileText size={16} /> Abrir PDF
                </a>
              </div>
            ) : lesson.contentUrl ? (
              <div className="p-8">
                <p className="whitespace-pre-wrap text-base leading-7 text-slate-200">{lesson.contentUrl}</p>
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center bg-[#0a0d19] text-sm text-slate-500">
                Conteúdo desta aula ainda não foi cadastrado.
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <CompleteLessonButton slug={course.slug} lessonId={lesson.id} completed={Boolean(lesson.completedAt)} />

            <div className="flex items-center gap-2">
              {previousLesson ? (
                <Link
                  href={`/aluno/${course.slug}/aulas/${previousLesson.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 hover:border-cyan-300/40 hover:text-cyan-200"
                >
                  <ChevronLeft size={16} /> Anterior
                </Link>
              ) : null}
              {nextLesson ? (
                <Link
                  href={`/aluno/${course.slug}/aulas/${nextLesson.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 hover:border-cyan-300/40 hover:text-cyan-200"
                >
                  Próxima <ChevronRight size={16} />
                </Link>
              ) : null}
            </div>
          </div>

          {allCompleted ? (
            <div className="mt-6 flex flex-col items-start gap-3 rounded-[26px] border border-emerald-400/25 bg-emerald-400/10 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-black text-emerald-200">Você concluiu todas as aulas desta formação!</p>
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
            <h2 className="font-black">Conteúdo do curso</h2>
            <span className="text-xs font-bold text-cyan-300">
              {completed}/{lessons.length}
            </span>
          </div>
          <div className="mt-5 space-y-2">
            {lessons.map((item) => (
              <Link
                key={item.id}
                href={`/aluno/${course.slug}/aulas/${item.id}`}
                className={
                  item.id === lesson.id
                    ? 'flex items-center gap-3 rounded-2xl border border-cyan-400/40 bg-cyan-400/10 p-3.5'
                    : 'flex items-center gap-3 rounded-2xl border border-white/10 bg-[#090c16] p-3.5 transition hover:border-cyan-400/30'
                }
              >
                <span className={item.completedAt ? 'text-emerald-400' : 'text-cyan-300'}>
                  {item.completedAt ? <CheckCircle2 size={17} /> : item.lessonType === 'PDF' ? <FileText size={17} /> : <PlayCircle size={17} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Aula {String(item.position).padStart(2, '0')}</p>
                  <p className="truncate text-sm font-bold">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
