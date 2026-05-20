import { getCaktoClient } from '@/lib/cakto/client'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/cakto/webhook
 * Recebe eventos de compra do Cakto
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data } = body

    console.log('[v0] Cakto webhook received:', event)

    const supabase = await createClient()

    // Log do webhook
    const { data: logData } = await supabase.from('webhook_logs').insert({
      source: 'cakto',
      event_type: event,
      payload: data,
      status: 'received',
    })

    // Processar evento de compra
    if (event === 'purchase.created' || event === 'purchase.approved') {
      const { customer_email, product_id, transaction_id, amount, status } = data

      // Encontrar curso por product_id
      const { data: curso } = await supabase
        .from('cursos')
        .select('id')
        .eq('cakto_product_id', product_id)
        .single()

      if (!curso) {
        console.error('[v0] Course not found for product:', product_id)
        return NextResponse.json({ error: 'Course not found' }, { status: 404 })
      }

      // Encontrar ou criar usuário/profile
      const { data: { user } } = await supabase.auth.admin.getUserByEmail(customer_email).catch(() => ({ data: { user: null } }))

      if (user) {
        // Registrar compra
        const { error: purchaseError } = await supabase.from('purchases').insert({
          user_id: user.id,
          curso_id: curso.id,
          kiwify_order_id: transaction_id, // Usando para Cakto também
          status: status === 'approved' ? 'approved' : 'pending',
          valor: amount,
          email_comprador: customer_email,
          metodo_pagamento: 'cakto',
          approved_at: status === 'approved' ? new Date() : null,
        })

        if (purchaseError) {
          console.error('[v0] Purchase insert error:', purchaseError)
        } else {
          console.log('[v0] Purchase registered:', transaction_id)
        }
      }

      // Atualizar webhook log como processado
      if (logData?.[0]?.id) {
        await supabase
          .from('webhook_logs')
          .update({ status: 'processed' })
          .eq('id', logData[0].id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Cakto webhook error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
