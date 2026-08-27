import { NextResponse } from 'next/server'
import { checkEmailSetup } from '@/lib/email'
import { currentPlatformUser, isPlatformAdmin } from '@/lib/learning-platform'

// Diagnóstico do envio de e-mails. Protegido: apenas admins autenticados.
// Nunca expõe a senha do SMTP, somente o erro devolvido pelo servidor.
export async function GET(request: Request) {
  const user = await currentPlatformUser()
  if (!user || !isPlatformAdmin(user.email)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  // ?test=1 envia uma mensagem real para o e-mail do admin logado.
  const sendTest = new URL(request.url).searchParams.get('test') === '1'
  const result = await checkEmailSetup(sendTest ? user.email : undefined)

  return NextResponse.json(result, { status: result.ok ? 200 : 503 })
}
