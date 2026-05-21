import { notifySale } from '@/lib/telegram'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cursoTitulo, valor, nomeCliente, email, metodo } = body

    // Validação básica
    if (!cursoTitulo || !valor) {
      return Response.json(
        { error: 'Curso e valor são obrigatórios' },
        { status: 400 }
      )
    }

    // Enviar notificação ao Telegram
    await notifySale(cursoTitulo, valor, nomeCliente || email)

    return Response.json(
      { success: true, message: 'Venda registrada' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Erro ao registrar venda:', error)
    return Response.json(
      { error: 'Erro ao processar venda' },
      { status: 500 }
    )
  }
}
