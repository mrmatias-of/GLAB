import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { comissoesService } from '@/lib/services/comissoes.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return apiResponse(null, 401, 'Unauthorized')

    const { searchParams } = new URL(req.url)
    const tecnicoId = searchParams.get('tecnicoId')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')

    if (!dataInicio || !dataFim) {
      return apiResponse(null, 400, 'dataInicio e dataFim são obrigatórios')
    }

    if (tecnicoId) {
      const comissao = await comissoesService.calcularComissaoTecnico(
        session.user.id,
        parseInt(tecnicoId),
        new Date(dataInicio),
        new Date(dataFim)
      )
      return apiResponse(comissao, 200, 'Comissão do técnico calculada')
    }

    const comissoes = await comissoesService.calcularComissoesTodosTecnicos(
      session.user.id,
      new Date(dataInicio),
      new Date(dataFim)
    )

    return apiResponse(comissoes, 200, 'Comissões calculadas com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
