import axios from 'axios'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

interface NotificationPayload {
  title: string
  message: string
  details?: Record<string, any>
  type?: 'sale' | 'signup' | 'error' | 'contact'
}

export async function sendTelegramNotification(payload: NotificationPayload) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('[v0] Telegram credentials not configured')
    return false
  }

  try {
    const emoji = getEmojiForType(payload.type || 'error')
    const formattedDetails = payload.details
      ? Object.entries(payload.details)
          .map(([key, value]) => `<b>${key}:</b> ${formatValue(value)}`)
          .join('\n')
      : ''

    const text = `${emoji} <b>${payload.title}</b>\n\n${payload.message}${
      formattedDetails ? `\n\n${formattedDetails}` : ''
    }\n\n<i>Timestamp: ${new Date().toLocaleString('pt-BR')}</i>`

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }
    )

    if (response.data.ok) {
      console.log('[v0] Telegram notification sent successfully')
      return true
    } else {
      console.error('[v0] Telegram API error:', response.data)
      return false
    }
  } catch (error) {
    console.error('[v0] Error sending Telegram notification:', error)
    return false
  }
}

function getEmojiForType(type: string): string {
  const emojis: Record<string, string> = {
    sale: '🛒',
    signup: '👤',
    error: '🔴',
    contact: '💬',
  }
  return emojis[type] || '📢'
}

function formatValue(value: any): string {
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

// Helpers para notificações específicas
export async function notifySale(cursoTitulo: string, valor: string, nomeCliente?: string) {
  return sendTelegramNotification({
    type: 'sale',
    title: 'Nova Venda! 🎉',
    message: `Um novo aluno adquiriu um curso`,
    details: {
      'Curso': cursoTitulo,
      'Valor': valor,
      ...(nomeCliente && { 'Cliente': nomeCliente }),
    },
  })
}

export async function notifySignup(email: string, nome?: string) {
  return sendTelegramNotification({
    type: 'signup',
    title: 'Novo Cadastro',
    message: `Um novo usuário se registrou`,
    details: {
      'Email': email,
      ...(nome && { 'Nome': nome }),
    },
  })
}

export async function notifyError(errorTitle: string, errorMessage: string, stack?: string) {
  return sendTelegramNotification({
    type: 'error',
    title: `Erro: ${errorTitle}`,
    message: errorMessage,
    details: {
      ...(stack && { 'Stack': stack.substring(0, 500) }),
    },
  })
}

export async function notifyContact(nome: string, email: string, mensagem: string) {
  return sendTelegramNotification({
    type: 'contact',
    title: 'Nova Mensagem de Contato',
    message: mensagem,
    details: {
      'Nome': nome,
      'Email': email,
    },
  })
}
