import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { financeiroService } from '@/src/modules/financeiro'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { id } = await params
    const transacao = await financeiroService.obter(session.user.id, parseInt(id))

    return apiResponse(transacao, 200, 'Transação obtida com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { id } = await params
    const dados = await req.json()
    const transacao = await financeiroService.atualizar(session.user.id, parseInt(id), dados)

    return apiResponse(transacao, 200, 'Transação atualizada com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { id } = await params
    await financeiroService.deletar(session.user.id, parseInt(id))

    return apiResponse(null, 200, 'Transação deletada com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
