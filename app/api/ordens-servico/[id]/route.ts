import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ordemService } from '@/src/modules/ordens'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { id } = await params
    const ordem = await ordemService.obter(session.user.id, parseInt(id))

    return apiResponse(ordem, 200, 'Ordem obtida com sucesso')
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
    const ordem = await ordemService.atualizar(session.user.id, parseInt(id), dados)

    return apiResponse(ordem, 200, 'Ordem atualizada com sucesso')
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
    await ordemService.deletar(session.user.id, parseInt(id))

    return apiResponse(null, 200, 'Ordem cancelada com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
