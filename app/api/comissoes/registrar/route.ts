import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { comissoesService } from '@/lib/services/comissoes.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return apiResponse(null, 401, 'Unauthorized')

    const { tecnicoId, dataInicio, dataFim } = await req.json()

    if (!tecnicoId || !dataInicio || !dataFim) {
      return apiResponse(null, 400, 'Dados obrigatórios faltando')
    }

    const resultado = await comissoesService.registrarPagamentoComissao(
      session.user.id,
      tecnicoId,
      new Date(dataInicio),
      new Date(dataFim)
    )

    return apiResponse(resultado, 201, 'Comissão registrada com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
