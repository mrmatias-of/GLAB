import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { servicosService } from '@/lib/services/servicos.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return apiResponse(null, 401, 'Unauthorized')

    const { searchParams } = new URL(req.url)
    const nome = searchParams.get('nome')

    const filtros = nome ? { nome } : {}
    const servicos = await servicosService.listar(session.user.id, filtros)

    return apiResponse(servicos, 200, 'Serviços listados com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return apiResponse(null, 401, 'Unauthorized')

    const dados = await req.json()
    const servico = await servicosService.criar(session.user.id, dados)

    return apiResponse(servico, 201, 'Serviço criado com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
