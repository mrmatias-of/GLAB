import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { tecnicoService } from '@/lib/services/tecnico.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const especialidade = searchParams.get('especialidade')
    const ativos = searchParams.get('ativos')

    let result
    if (ativos === 'true') {
      result = await tecnicoService.listarAtivos(session.user.id)
    } else {
      const filtros: any = {}
      if (status) filtros.status = status
      if (especialidade) filtros.especialidade = especialidade
      result = await tecnicoService.listar(session.user.id, filtros)
    }

    return apiResponse(result, 200, 'Técnicos listados com sucesso')
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
    const tecnico = await tecnicoService.criar(session.user.id, dados)

    return apiResponse(tecnico, 201, 'Técnico criado com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
