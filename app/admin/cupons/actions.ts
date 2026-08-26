'use server'

import { revalidatePath } from 'next/cache'
import { createCoupon, setCouponActive } from '@/lib/learning-platform'
import { requireAdmin } from '@/lib/require-admin'

export type CreateCouponActionState = { error?: string; success?: boolean }

export async function createCouponAction(
  _prevState: CreateCouponActionState,
  formData: FormData,
): Promise<CreateCouponActionState> {
  await requireAdmin()

  const code = String(formData.get('code') ?? '')
  const description = String(formData.get('description') ?? '')
  const discountType = String(formData.get('discountType') ?? 'PERCENT') === 'FIXED' ? 'FIXED' : 'PERCENT'
  const discountValueRaw = Number(formData.get('discountValue'))
  // Valor fixo é digitado em reais no formulário; convertemos para centavos
  // aqui para armazenar na mesma unidade usada em glab_orders.amount_cents.
  const discountValue = discountType === 'FIXED' ? Math.round(discountValueRaw * 100) : discountValueRaw
  const productIdRaw = String(formData.get('productId') ?? '')
  const maxRedemptionsRaw = String(formData.get('maxRedemptions') ?? '')
  const expiresAtRaw = String(formData.get('expiresAt') ?? '')

  try {
    await createCoupon({
      code,
      description,
      discountType,
      discountValue,
      productId: productIdRaw ? Number(productIdRaw) : null,
      maxRedemptions: maxRedemptionsRaw ? Number(maxRedemptionsRaw) : null,
      expiresAt: expiresAtRaw || null,
    })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Não foi possível criar o cupom.' }
  }

  revalidatePath('/admin/cupons')
  return { success: true }
}

export async function toggleCouponAction(id: number, isActive: boolean) {
  await requireAdmin()
  await setCouponActive(id, isActive)
  revalidatePath('/admin/cupons')
}
