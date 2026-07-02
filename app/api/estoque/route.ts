import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { estoqueService } from '@/src/modules/estoque'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { searchParams } = new URL(req.url)
    const categoria = searchParams.get('categoria')
    const ativo = searchParams.get('ativo')
    const estoqueBaixo = searchParams.get('estoqueBaixo')
    const resumo = searchParams.get('resumo')

    if (resumo === 'true') {
      const result = await estoqueService.obterResumo(session.user.id)
      return apiResponse(result, 200, 'Resumo obtido com sucesso')
    }

    let result
    if (estoqueBaixo === 'true') {
      result = await estoqueService.obterEstoqueBaixo(session.user.id)
    } else {
      const filtros: any = {}
      if (categoria) filtros.categoria = categoria
      if (ativo !== null) filtros.ativo = ativo === 'true'
      result = await estoqueService.listar(session.user.id, filtros)
    }

    return apiResponse(result, 200, 'Itens listados com sucesso')
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
    const item = await estoqueService.criar(session.user.id, dados)

    return apiResponse(item, 201, 'Item criado com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
