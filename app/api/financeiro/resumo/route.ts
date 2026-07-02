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
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')

    let inicio, fim
    if (dataInicio && dataFim) {
      inicio = new Date(dataInicio)
      fim = new Date(dataFim)
    }

    const resumo = await financeiroService.obterResumo(session.user.id, inicio, fim)
    return apiResponse(resumo, 200, 'Resumo obtido com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
