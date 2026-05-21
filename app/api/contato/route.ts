import { notifyContact } from '@/lib/telegram'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, email, assunto, mensagem } = body

    // Validação básica
    if (!nome || !email || !mensagem) {
      return Response.json(
        { error: 'Nome, email e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Enviar notificação ao Telegram
    await notifyContact(nome, email, `${assunto ? `Assunto: ${assunto}\n\n` : ''}${mensagem}`)

    return Response.json(
      { success: true, message: 'Mensagem enviada com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Erro ao processar contato:', error)
    return Response.json(
      { error: 'Erro ao processar sua solicitação' },
      { status: 500 }
    )
  }
}
