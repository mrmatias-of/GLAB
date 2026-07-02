import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { estoqueService } from '@/src/modules/estoque'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { searchParams } = new URL(req.url)
    const estoqueId = searchParams.get('estoqueId')

    const movimentacoes = await estoqueService.obterMovimentacoes(
      session.user.id,
      estoqueId ? parseInt(estoqueId) : undefined
    )

    return apiResponse(movimentacoes, 200, 'Movimentações obtidas com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { estoqueId, tipo, quantidade, motivo } = await req.json()

    if (!['entrada', 'saida', 'ajuste'].includes(tipo)) {
      return apiResponse(null, 400, 'Tipo de movimentação inválido')
    }

    if (tipo === 'entrada') {
      await estoqueService.adicionarQuantidade(session.user.id, estoqueId, quantidade, motivo)
    } else if (tipo === 'saida') {
      await estoqueService.removerQuantidade(session.user.id, estoqueId, quantidade, motivo)
    }

    return apiResponse(null, 201, 'Movimentação registrada com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
