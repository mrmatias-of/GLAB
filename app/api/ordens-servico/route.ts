import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ordemService } from '@/lib/services/ordem.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const clienteId = searchParams.get('clienteId')
    const tecnicoId = searchParams.get('tecnicoId')

    const filtros: any = {}
    if (status) filtros.status = status
    if (clienteId) filtros.clienteId = parseInt(clienteId)
    if (tecnicoId) filtros.tecnicoId = parseInt(tecnicoId)

    const ordens = await ordemService.listar(session.user.id, filtros)
    return apiResponse(ordens, 200, 'Ordens listadas com sucesso')
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

    const dados = await req.json()
    const ordem = await ordemService.criar(session.user.id, dados)

    return apiResponse(ordem, 201, 'Ordem criada com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
