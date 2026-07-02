import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { financeiroService } from '@/src/modules/financeiro'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return apiResponse(null, 401, 'Unauthorized')
    }

    const { searchParams } = new URL(req.url)
    const tipo = searchParams.get('tipo')
    const status = searchParams.get('status')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const dashboard = searchParams.get('dashboard')

    if (dashboard === 'true') {
      const result = await financeiroService.obterDashboard(session.user.id)
      return apiResponse(result, 200, 'Dashboard obtido com sucesso')
    }

    const filtros: any = {}
    if (tipo) filtros.tipo = tipo
    if (status) filtros.status = status
    if (dataInicio && dataFim) {
      filtros.dataInicio = new Date(dataInicio)
      filtros.dataFim = new Date(dataFim)
    }

    const transacoes = await financeiroService.listar(session.user.id, filtros)
    return apiResponse(transacoes, 200, 'Transações listadas com sucesso')
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
    const transacao = await financeiroService.criar(session.user.id, dados)

    return apiResponse(transacao, 201, 'Transação criada com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
