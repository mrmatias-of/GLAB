import { NextRequest, NextResponse } from 'next/server'
import { sendMessage } from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const { nome, email, assunto, mensagem } = await request.json()

    // Validação
    if (!nome || !email || !mensagem) {
      return NextResponse.json(
        { error: 'Nome, email e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Enviar notificação no Telegram
    const telegramMessage = [
      '<b>💬 Nova mensagem de contato</b>',
      '',
      `<b>Nome:</b> ${nome}`,
      `<b>Email:</b> ${email}`,
      assunto ? `<b>Assunto:</b> ${assunto}` : '',
      '',
      `<b>Mensagem:</b>`,
      mensagem,
    ]
      .filter(line => line !== '')
      .join('\n')

    try {
      await sendMessage(telegramMessage)
    } catch (telegramError) {
      console.error('[contact] Erro ao enviar para Telegram:', telegramError)
      // Continuar mesmo se falhar, pois a mensagem foi recebida
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso' 
    }, { status: 200 })

  } catch (error: any) {
    console.error('[contact] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
}
