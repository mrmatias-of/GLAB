import { notifySignup } from '@/lib/telegram'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, nome, telefone } = body

    // Validação básica
    if (!email) {
      return Response.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Enviar notificação ao Telegram
    await notifySignup(email, nome)

    return Response.json(
      { success: true, message: 'Cadastro realizado' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Erro ao registrar cadastro:', error)
    return Response.json(
      { error: 'Erro ao processar cadastro' },
      { status: 500 }
    )
  }
}
