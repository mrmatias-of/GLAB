import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { geolocalizacaoService } from '@/lib/services/geolocation.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return apiResponse(null, 401, 'Unauthorized')

    const { tecnicoId, latitude, longitude } = await req.json()

    if (!tecnicoId || latitude === undefined || longitude === undefined) {
      return apiResponse(null, 400, 'Dados de geolocalização incompletos')
    }

    const resultado = geolocalizacaoService.registrarLocalizacao(tecnicoId, latitude, longitude)

    return apiResponse(resultado, 200, 'Localização registrada')
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
    const latitude = searchParams.get('latitude')
    const longitude = searchParams.get('longitude')
    const raioKm = searchParams.get('raioKm')

    if (action === 'obter' && tecnicoId) {
      const localizacao = geolocalizacaoService.obterLocalizacao(parseInt(tecnicoId))
      return apiResponse(localizacao, 200, 'Localização obtida')
    }

    if (action === 'proximos' && latitude && longitude) {
      const proximos = geolocalizacaoService.obterTecnicosProximos(
        parseFloat(latitude),
        parseFloat(longitude),
        raioKm ? parseInt(raioKm) : 5
      )
      return apiResponse(proximos, 200, 'Técnicos próximos encontrados')
    }

    if (action === 'online') {
      const online = geolocalizacaoService.obterTodosTecnicosOnline()
      return apiResponse(online, 200, 'Técnicos online')
    }

    if (action === 'limpar') {
      const resultado = geolocalizacaoService.limparLocalizacoesAntigas(120)
      return apiResponse(resultado, 200, 'Limpeza de localizações realizada')
    }

    return apiResponse(null, 400, 'Action inválido')
  } catch (error) {
    return handleApiError(error)
  }
}
