import { getCaktoClient } from '@/lib/cakto/client'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/cakto/create-product
 * Cria um produto no Cakto e salva o link de checkout no curso
 * 
 * Body:
 * {
 *   "curso_id": "uuid",
 *   "titulo": "Nome do Curso",
 *   "descricao": "Descrição curta",
 *   "preco": 97.00,
 *   "thumbnail_url": "https://..."
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verifica autenticação (admin only)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.is_admin !== true) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { curso_id, titulo, descricao, preco, thumbnail_url } = body

    if (!curso_id || !titulo || !descricao || !preco) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('[v0] Cakto: Creating product for course', curso_id)

    // Criar produto no Cakto
    const cakto = getCaktoClient()
    const product = await cakto.createProduct({
      name: titulo,
      description: descricao,
      price: parseFloat(preco.toString()),
      image_url: thumbnail_url,
    })

    console.log('[v0] Cakto: Product created', product.id)

    // Salvar link de checkout e Cakto product ID no Supabase
    const { error } = await supabase
      .from('cursos')
      .update({
        cta_href: product.checkout_url,
        cakto_product_id: product.id,
      })
      .eq('id', curso_id)

    if (error) {
      console.error('[v0] Supabase update error:', error)
      return NextResponse.json(
        { error: 'Failed to save Cakto data' },
        { status: 500 }
      )
    }

    // Também grava o webhook log
    await supabase.from('webhook_logs').insert({
      source: 'cakto',
      event_type: 'product_created',
      payload: {
        curso_id,
        product_id: product.id,
        checkout_url: product.checkout_url,
      },
      status: 'processed',
    })

    return NextResponse.json({
      success: true,
      product_id: product.id,
      checkout_url: product.checkout_url,
      affiliate_url: product.affiliate_url,
    })
  } catch (error) {
    console.error('[v0] Cakto endpoint error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
