'use server'

import { revalidatePath } from 'next/cache'
import { currentPlatformUser, courseForStudent, lessonsWithProgress, markLessonComplete } from '@/lib/learning-platform'

export async function markLessonCompleteAction(slug: string, lessonId: number) {
  const user = await currentPlatformUser()
  if (!user) throw new Error('Sessão expirada. Faça login novamente.')

  const course = await courseForStudent(slug, user.email)
  if (!course) throw new Error('Você não tem acesso a este curso.')

  const lessons = await lessonsWithProgress(course.id, course.enrollmentId)
  const belongsToCourse = lessons.some((lesson) => lesson.id === lessonId)
  if (!belongsToCourse) throw new Error('Esta aula não pertence ao curso matriculado.')

  await markLessonComplete(course.enrollmentId, lessonId)

  revalidatePath(`/aluno/${slug}`)
  revalidatePath(`/aluno/${slug}/aulas/${lessonId}`)
}
