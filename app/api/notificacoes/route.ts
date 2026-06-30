import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notificacoesService } from '@/lib/services/notificacoes.service'
import { apiResponse, handleApiError } from '@/lib/utils/api-response'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return apiResponse(null, 401, 'Unauthorized')

    const { tipo, destinatario, assunto, corpo, html, telefone, mensagem } = await req.json()

    if (!tipo) {
      return apiResponse(null, 400, 'Tipo de notificação é obrigatório')
    }

    let resultado

    switch (tipo) {
      case 'email':
        if (!destinatario || !assunto || !corpo) {
          return apiResponse(null, 400, 'Dados de email incompletos')
        }
        resultado = await notificacoesService.enviarEmail(destinatario, assunto, corpo, html)
        break

      case 'whatsapp':
        if (!telefone || !mensagem) {
          return apiResponse(null, 400, 'Dados de WhatsApp incompletos')
        }
        resultado = await notificacoesService.enviarWhatsApp(telefone, mensagem)
        break

      case 'sms':
        if (!telefone || !mensagem) {
          return apiResponse(null, 400, 'Dados de SMS incompletos')
        }
        resultado = await notificacoesService.enviarSMS(telefone, mensagem)
        break

      default:
        return apiResponse(null, 400, 'Tipo de notificação inválido')
    }

    return apiResponse(resultado, 200, 'Notificação enviada com sucesso')
  } catch (error) {
    return handleApiError(error)
  }
}
