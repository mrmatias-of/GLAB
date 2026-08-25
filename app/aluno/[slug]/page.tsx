import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, CheckCircle2, FileText, LockKeyhole, PlayCircle } from 'lucide-react'
import { currentPlatformUser } from '@/lib/learning-platform'
import { pool } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

export const dynamic = 'force-dynamic'

type Lesson = RowDataPacket & { id: number; position: number; title: string; lessonType: string; contentUrl: string | null; isPreview: number; completedAt: Date | null }

export default async function CursoAlunoPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await currentPlatformUser()
  if (!user) redirect('/sign-in')
  const slug = (await params).slug
  const [courseRows] = await pool.execute<Array<RowDataPacket & { id: number; title: string; description: string | null; enrollmentId: string }>>(
    `SELECT p.id, p.title, p.description, e.id AS enrollmentId
     FROM glab_enrollments e INNER JOIN glab_products p ON p.id = e.product_id
     WHERE p.slug = ? AND e.student_email = ? AND e.status = 'ACTIVE' LIMIT 1`, [slug, user.email],
  )
  const course = courseRows[0]
  if (!course) notFound()
  const [lessons] = await pool.execute<Lesson[]>(
    `SELECT l.id, l.position, l.title, l.lesson_type AS lessonType, l.content_url AS contentUrl, l.is_preview AS isPreview, lp.completed_at AS completedAt
     FROM glab_lessons l LEFT JOIN glab_lesson_progress lp ON lp.lesson_id = l.id AND lp.enrollment_id = ?
     WHERE l.product_id = ? AND l.is_active = 1 ORDER BY l.position`, [course.enrollmentId, course.id],
  )
  const completed = lessons.filter((lesson) => lesson.completedAt).length
  return <div className="mx-auto max-w-6xl px-5 py-10 md:px-8"><Link href="/aluno" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-cyan-200"><ArrowLeft size={15} /> Minha biblioteca</Link><div className="mt-8 grid gap-10 lg:grid-cols-[1fr_.52fr]"><section><p className="text-xs font-black uppercase tracking-[.18em] text-cyan-400">Formação G‑LAB</p><h1 className="mt-3 text-4xl font-black tracking-[-.04em] md:text-5xl">{course.title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{course.description}</p><div className="mt-9 overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0d19]"><div className="flex aspect-video items-center justify-center bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,.22),transparent_45%),linear-gradient(135deg,#101b35,#090b15)]"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-300 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,.45)]"><PlayCircle size={31} /></span></div><div className="p-6"><h2 className="font-black">Aulas e materiais</h2><p className="mt-2 text-sm text-slate-400">Selecione uma aula abaixo. Materiais protegidos serão liberados somente pela plataforma.</p></div></div></section><aside className="h-fit rounded-[26px] border border-white/10 bg-white/[.025] p-6"><div className="flex items-center justify-between"><h2 className="font-black">Seu progresso</h2><span className="text-xs font-bold text-cyan-300">{completed}/{lessons.length}</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${lessons.length ? Math.round((completed / lessons.length) * 100) : 0}%` }} /></div><div className="mt-7 space-y-3">{lessons.length === 0 ? <p className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-slate-400">O material desta formação está sendo organizado pela equipe G‑LAB.</p> : lessons.map((lesson) => <div key={lesson.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#090c16] p-4"><span className={lesson.completedAt ? 'text-emerald-400' : 'text-cyan-300'}>{lesson.completedAt ? <CheckCircle2 size={18} /> : lesson.lessonType === 'PDF' ? <FileText size={18} /> : <LockKeyhole size={18} />}</span><div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Aula {String(lesson.position).padStart(2, '0')}</p><p className="truncate text-sm font-bold">{lesson.title}</p></div></div>)}</div></aside></div></div>
}
