import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { roteamentoService } from '@/lib/services/roteamento.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return apiResponse(null, 401, 'Unauthorized')

    const { osId } = await req.json()

    if (!osId) {
      return apiResponse(null, 400, 'osId é obrigatório')
    }

    const tecnico = await roteamentoService.atribuirOSAutomaticamente(session.user.id, osId)

    return apiResponse(tecnico, 200, 'OS atribuída automaticamente')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return apiResponse(null, 401, 'Unauthorized')

    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    const tecnicoId = searchParams.get('tecnicoId')

    if (action === 'alertas-sla') {
      const alertas = await roteamentoService.alertaSLA(session.user.id)
      return apiResponse(alertas, 200, 'Alertas de SLA obtidos')
    }

    if (action === 'otimizar-rota' && tecnicoId) {
      const rota = await roteamentoService.otimizarRotaTecnicos(session.user.id, parseInt(tecnicoId))
      return apiResponse(rota, 200, 'Rota otimizada')
    }

    return apiResponse(null, 400, 'Action inválido')
  } catch (error) {
    return handleApiError(error)
  }
}
