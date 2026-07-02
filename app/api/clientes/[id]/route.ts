import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { clienteService } from '@/src/modules/clientes'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { id } = await params
    const cliente = await clienteService.obter(session.user.id, parseInt(id))

    return apiResponse(cliente, 200, 'Cliente obtido com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { id } = await params
    const dados = await req.json()
    const cliente = await clienteService.atualizar(session.user.id, parseInt(id), dados)

    return apiResponse(cliente, 200, 'Cliente atualizado com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { id } = await params
    await clienteService.deletar(session.user.id, parseInt(id))

    return apiResponse(null, 200, 'Cliente deletado com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
