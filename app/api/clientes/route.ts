import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { clienteService } from '@/src/modules/clientes'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { searchParams } = new URL(req.url)
    const ativo = searchParams.get('ativo')
    const cidade = searchParams.get('cidade')

    const filtros: any = {}
    if (ativo !== null) filtros.ativo = ativo === 'true'
    if (cidade) filtros.cidade = cidade

    const clientes = await clienteService.listar(session.user.id, filtros)
    return apiResponse(clientes, 200, 'Clientes listados com sucesso')
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
    const cliente = await clienteService.criar(session.user.id, dados)

    return apiResponse(cliente, 201, 'Cliente criado com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
