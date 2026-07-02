import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { estoqueService } from '@/lib/services/estoque.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest, { params } Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { id } = await params
    const item = await estoqueService.obter(session.user.id, parseInt(id))
    const movimentacoes = await estoqueService.obterMovimentacoes(session.user.id, parseInt(id))

    return apiResponse({ item, movimentacoes }, 200, 'Item obtido com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(req: NextRequest, { params } Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { id } = await params
    const dados = await req.json()
    const item = await estoqueService.atualizar(session.user.id, parseInt(id), dados)

    return apiResponse(item, 200, 'Item atualizado com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: NextRequest, { params } Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { id } = await params
    await estoqueService.deletar(session.user.id, parseInt(id))

    return apiResponse(null, 200, 'Item deletado com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
