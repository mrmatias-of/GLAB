'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/require-admin'
import {
  createProduct,
  updateProduct,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLesson,
  type SaveProductInput,
  type SaveLessonInput,
} from '@/lib/learning-platform'
import { parsePriceToCents } from '@/lib/price'

export type ProductActionState = { error?: string; success?: boolean }

function readProductInput(formData: FormData): SaveProductInput {
  return {
    title: String(formData.get('title') ?? ''),
    slug: String(formData.get('slug') ?? ''),
    description: String(formData.get('description') ?? ''),
    priceCents: parsePriceToCents(formData.get('price')),
    coverUrl: String(formData.get('coverUrl') ?? '') || null,
    isActive: formData.get('isActive') === 'on',
  }
}

export async function createProductAction(
  _prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAdmin()

  let id: number
  try {
    id = await createProduct(readProductInput(formData))
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Não foi possível criar o curso.' }
  }

  revalidatePath('/admin/cursos')
  redirect(`/admin/cursos/${id}`)
}

export async function updateProductAction(
  id: number,
  _prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAdmin()

  try {
    await updateProduct(id, readProductInput(formData))
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Não foi possível salvar o curso.' }
  }

  revalidatePath('/admin/cursos')
  revalidatePath(`/admin/cursos/${id}`)
  return { success: true }
}

export type LessonActionState = { error?: string; success?: boolean }

function readLessonInput(productId: number, formData: FormData): SaveLessonInput {
  return {
    productId,
    title: String(formData.get('title') ?? ''),
    lessonType: (String(formData.get('lessonType') ?? 'VIDEO') as SaveLessonInput['lessonType']) || 'VIDEO',
    contentUrl: String(formData.get('contentUrl') ?? '') || null,
    isPreview: formData.get('isPreview') === 'on',
    isActive: formData.get('isActive') === 'on',
  }
}

export async function createLessonAction(
  productId: number,
  _prevState: LessonActionState,
  formData: FormData,
): Promise<LessonActionState> {
  await requireAdmin()

  try {
    await createLesson(readLessonInput(productId, formData))
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Não foi possível criar a aula.' }
  }

  revalidatePath(`/admin/cursos/${productId}`)
  return { success: true }
}

export async function updateLessonAction(
  productId: number,
  lessonId: number,
  _prevState: LessonActionState,
  formData: FormData,
): Promise<LessonActionState> {
  await requireAdmin()

  try {
    await updateLesson(lessonId, readLessonInput(productId, formData))
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Não foi possível salvar a aula.' }
  }

  revalidatePath(`/admin/cursos/${productId}`)
  return { success: true }
}

export async function deleteLessonAction(productId: number, lessonId: number) {
  await requireAdmin()
  await deleteLesson(lessonId)
  revalidatePath(`/admin/cursos/${productId}`)
}

export async function reorderLessonAction(productId: number, lessonId: number, direction: 'up' | 'down') {
  await requireAdmin()
  await reorderLesson(productId, lessonId, direction)
  revalidatePath(`/admin/cursos/${productId}`)
}
