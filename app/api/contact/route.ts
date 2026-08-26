import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]!)
}

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

    const safeNome = escapeHtml(String(nome))
    const safeEmail = escapeHtml(String(email))
    const safeAssunto = assunto ? escapeHtml(String(assunto)) : null
    const safeMensagem = escapeHtml(String(mensagem)).replace(/\n/g, '<br>')

    const notifyTo = process.env.CONTACT_NOTIFICATION_EMAIL ?? 'suporte@glabcursos.com.br'

    try {
      await sendEmail({
        to: notifyTo,
        subject: safeAssunto ? `Contato · ${safeAssunto}` : 'Nova mensagem de contato',
        html: `<p><strong>Nome:</strong> ${safeNome}</p><p><strong>Email:</strong> ${safeEmail}</p>${safeAssunto ? `<p><strong>Assunto:</strong> ${safeAssunto}</p>` : ''}<p><strong>Mensagem:</strong></p><p>${safeMensagem}</p>`,
        text: `Nome: ${nome}\nEmail: ${email}\n${assunto ? `Assunto: ${assunto}\n` : ''}\nMensagem:\n${mensagem}`,
      })
    } catch (emailError) {
      console.error('[contact] Erro ao enviar e-mail:', emailError)
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
