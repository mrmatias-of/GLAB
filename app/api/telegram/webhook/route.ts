/**
 * POST /api/telegram/webhook
 *
 * Recebe todos os updates do bot, autentica o admin pelo telegram_id,
 * roteia o comando e registra log.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { replyMessage } from '@/lib/telegram'
import { handleCommand } from '@/lib/telegram/commands'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Valida o secret configurado no Telegram (setWebhook ?secret_token=...)
function validateSecret(req: NextRequest): boolean {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (!secret) return true // sem segredo configurado, aceita tudo
  return req.headers.get('x-telegram-bot-api-secret-token') === secret
}

export async function POST(req: NextRequest) {
  if (!validateSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let update: TelegramUpdate
  try {
    update = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Suporta mensagens de texto e callback de botões inline
  const message  = update.message ?? update.edited_message
  const callback = update.callback_query

  const chatId     = message?.chat.id ?? callback?.message?.chat.id
  const telegramId = message?.from?.id ?? callback?.from?.id
  const username   = message?.from?.username ?? callback?.from?.username ?? ''
  const text       = message?.text ?? callback?.data ?? ''

  if (!chatId || !telegramId || !text) {
    return NextResponse.json({ ok: true })
  }

  const supabase = getServiceClient()

  // Verificar se é admin autorizado
  const { data: admin } = await supabase
    .from('telegram_admins')
    .select('*')
    .eq('telegram_id', telegramId)
    .eq('ativo', true)
    .single()

  if (!admin) {
    await replyMessage(chatId, 
      '<b>Acesso negado.</b>\n\nVoce nao esta autorizado a usar este bot.\n\nSeu ID: <code>' + telegramId + '</code>'
    )
    await supabase.from('telegram_logs').insert({
      telegram_id: telegramId,
      username,
      command: text,
      status: 'unauthorized',
    })
    return NextResponse.json({ ok: true })
  }

  // Extrair comando e argumentos
  const [rawCommand, ...args] = text.trim().split(/\s+/)
  const command = rawCommand.toLowerCase().replace('@' + (process.env.TELEGRAM_BOT_USERNAME ?? ''), '')

  // Log de entrada
  await supabase.from('telegram_logs').insert({
    telegram_id: telegramId,
    username,
    command,
    payload: args.join(' ') || null,
    status: 'ok',
  })

  // Executar o handler do comando
  try {
    await handleCommand({ command, args, chatId, admin, supabase })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('[telegram/webhook] Erro ao executar comando:', msg)
    await replyMessage(chatId, `<b>Erro ao executar comando:</b> ${msg}`)
    await supabase.from('telegram_logs')
      .update({ status: 'error', error: msg })
      .eq('telegram_id', telegramId)
      .order('created_at', { ascending: false })
      .limit(1)
  }

  return NextResponse.json({ ok: true })
}

// GET: health check
export async function GET() {
  return NextResponse.json({ status: 'active', endpoint: '/api/telegram/webhook' })
}

// ─── Tipos locais do Update do Telegram ──────────────────────────────────────

interface TelegramUser {
  id: number
  username?: string
  first_name?: string
}

interface TelegramChat {
  id: number
  type: string
}

interface TelegramMessage {
  message_id: number
  from?: TelegramUser
  chat: TelegramChat
  text?: string
  date: number
}

interface TelegramCallbackQuery {
  id: string
  from: TelegramUser
  message?: TelegramMessage
  data?: string
}

interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  edited_message?: TelegramMessage
  callback_query?: TelegramCallbackQuery
}
