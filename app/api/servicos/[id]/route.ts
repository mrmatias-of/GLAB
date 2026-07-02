import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { servicosService } from '@/lib/services/servicos.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return apiResponse(null, 401, 'Unauthorized')

    const { id } = await params
    const servico = await servicosService.obter(session.user.id, parseInt(id))

    return apiResponse(servico, 200, 'Serviço obtido com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return apiResponse(null, 401, 'Unauthorized')

    const { id } = await params
    const dados = await req.json()
    const servico = await servicosService.atualizar(session.user.id, parseInt(id), dados)

    return apiResponse(servico, 200, 'Serviço atualizado com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return apiResponse(null, 401, 'Unauthorized')

    const { id } = await params
    await servicosService.deletar(session.user.id, parseInt(id))

    return apiResponse(null, 200, 'Serviço deletado com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
