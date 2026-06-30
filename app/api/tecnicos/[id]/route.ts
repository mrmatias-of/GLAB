import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { tecnicoService } from '@/lib/services/tecnico.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { id } = await params
    const tecnico = await tecnicoService.obter(session.user.id, parseInt(id))

    return apiResponse(tecnico, 200, 'Técnico obtido com sucesso')
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
    const tecnico = await tecnicoService.atualizar(session.user.id, parseInt(id), dados)

    return apiResponse(tecnico, 200, 'Técnico atualizado com sucesso')
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
    await tecnicoService.deletar(session.user.id, parseInt(id))

    return apiResponse(null, 200, 'Técnico desativado com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
