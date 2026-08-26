'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/require-admin'
import { grantManualEnrollment } from '@/lib/learning-platform'

export type ManualEnrollmentActionState = { error?: string; success?: boolean }

export async function grantManualEnrollmentAction(
  _prevState: ManualEnrollmentActionState,
  formData: FormData,
): Promise<ManualEnrollmentActionState> {
  await requireAdmin()

  const studentEmail = String(formData.get('studentEmail') ?? '')
  const productIdRaw = String(formData.get('productId') ?? '')
  const productId = Number(productIdRaw)

  if (!productIdRaw || !Number.isFinite(productId)) {
    return { error: 'Selecione um curso.' }
  }

  try {
    await grantManualEnrollment(studentEmail, productId)
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Não foi possível liberar o acesso.' }
  }

  revalidatePath('/admin/matriculas')
  return { success: true }
}
