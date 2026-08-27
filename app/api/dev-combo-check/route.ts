import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import {
  bundleCandidates,
  clearBundleItems,
  entitledProductIds,
  platformBundles,
  saveBundle,
} from '@/lib/learning-platform'

export const dynamic = 'force-dynamic'

export async function GET() {
  const log: unknown[] = []
  let createdId: number | null = null

  try {
    const candidates = await bundleCandidates()
    const courses = candidates.filter((c) => c.isBundle === 0).slice(0, 3)
    const existingCombo = candidates.find((c) => c.isBundle === 1)

    // 1. cria combo com produto + itens em uma operação
    createdId = await saveBundle(
      {
        title: 'DEV Combo Teste',
        slug: 'dev-combo-teste',
        description: 'temporario',
        priceCents: 4990,
        coverUrl: null,
        isActive: false,
      },
      courses.map((c) => c.id),
    )
    log.push({ passo: 'criar', id: createdId, itens: courses.map((c) => c.title) })

    // 2. a compra do combo libera exatamente os cursos escolhidos
    log.push({ passo: 'libera', ids: await entitledProductIds(pool, createdId) })

    // 3. aparece na listagem de combos com soma dos avulsos
    const listed = (await platformBundles()).find((b) => b.id === createdId)
    log.push({
      passo: 'listagem',
      itemCount: listed?.itemCount,
      partsCents: Number(listed?.partsCents),
      priceCents: listed?.priceCents,
    })

    // 4. combo dentro de combo é bloqueado
    if (existingCombo) {
      try {
        await saveBundle({ id: createdId, title: 'DEV Combo Teste', priceCents: 4990, isActive: false }, [
          existingCombo.id,
        ])
        log.push({ passo: 'combo-aninhado', resultado: 'FALHOU: permitiu' })
      } catch (error) {
        log.push({ passo: 'combo-aninhado', bloqueado: (error as Error).message })
      }
    }

    // 5. combo sem nenhum curso é rejeitado
    try {
      await saveBundle({ id: createdId, title: 'DEV Combo Teste', priceCents: 4990, isActive: false }, [])
      log.push({ passo: 'combo-vazio', resultado: 'FALHOU: permitiu' })
    } catch (error) {
      log.push({ passo: 'combo-vazio', bloqueado: (error as Error).message })
    }

    // 6. desfazer combo mantém o produto e zera os itens
    await clearBundleItems(createdId)
    log.push({ passo: 'desfazer', libera: await entitledProductIds(pool, createdId) })

    return NextResponse.json({ ok: true, log })
  } catch (error) {
    return NextResponse.json({ ok: false, erro: (error as Error).message, log }, { status: 500 })
  } finally {
    if (createdId) {
      await pool.execute('DELETE FROM glab_product_bundle_items WHERE bundle_product_id = ?', [createdId])
      await pool.execute('DELETE FROM glab_products WHERE id = ?', [createdId])
    }
  }
}
