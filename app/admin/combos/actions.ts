'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/require-admin'
import { clearBundleItems, saveBundle, type SaveBundleInput } from '@/lib/learning-platform'

export type ComboActionState = { error?: string; success?: boolean }

function readComboInput(formData: FormData): SaveBundleInput {
  return {
    title: String(formData.get('title') ?? ''),
    slug: String(formData.get('slug') ?? ''),
    description: String(formData.get('description') ?? ''),
    priceCents: Math.round(Number(formData.get('price') ?? 0) * 100),
    coverUrl: String(formData.get('coverUrl') ?? '') || null,
    isActive: formData.get('isActive') === 'on',
  }
}

function readItemIds(formData: FormData) {
  return formData.getAll('itemIds').map((value) => Number(value))
}

function revalidateCombo(id?: number) {
  revalidatePath('/admin/combos')
  revalidatePath('/admin/cursos')
  if (id) revalidatePath(`/admin/combos/${id}`)
}

export async function createComboAction(
  _prevState: ComboActionState,
  formData: FormData,
): Promise<ComboActionState> {
  await requireAdmin()

  let id: number
  try {
    id = await saveBundle(readComboInput(formData), readItemIds(formData))
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Não foi possível criar o combo.' }
  }

  revalidateCombo(id)
  redirect(`/admin/combos/${id}`)
}

export async function updateComboAction(
  id: number,
  _prevState: ComboActionState,
  formData: FormData,
): Promise<ComboActionState> {
  await requireAdmin()

  try {
    await saveBundle({ ...readComboInput(formData), id }, readItemIds(formData))
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Não foi possível salvar o combo.' }
  }

  revalidateCombo(id)
  return { success: true }
}

/** Deixa de ser combo: o produto continua no catálogo como curso avulso. */
export async function dissolveComboAction(id: number) {
  await requireAdmin()
  await clearBundleItems(id)
  revalidateCombo(id)
  redirect('/admin/combos')
}
