/**
 * lib/telegram/commands.ts
 * Router central de comandos do bot.
 * Cada comando é um handler isolado que recebe contexto e responde via replyMessage.
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { replyMessage } from '@/lib/telegram'
import { handleDashboard } from './handlers/dashboard'
import { handleVendas }    from './handlers/vendas'
import { handleCursos }    from './handlers/cursos'
import { handleMensagens } from './handlers/mensagens'
import { handleV0 }        from './handlers/v0'

export interface CommandContext {
  command: string
  args: string[]
  text: string
  chatId: number
  userId: number
  username?: string
  admin: { telegram_id: number; username?: string; nome?: string; role: string }
  supabase: SupabaseClient
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://glabcursos.com.br'

export async function handleCommand(ctx: CommandContext): Promise<void> {
  const { command, chatId } = ctx

  switch (command) {
    case '/start':
    case '/ajuda':
    case '/help':
      await replyMessage(chatId, buildHelp(ctx.admin.nome ?? ctx.admin.username ?? 'Admin'))
      break

    case '/dashboard':
      await handleDashboard(ctx)
      break

    case '/vendas':
      await handleVendas(ctx)
      break

    case '/cursos':
      await handleCursos(ctx)
      break

    case '/mensagens':
      await handleMensagens(ctx)
      break

    case '/v0':
      await handleV0({
        chatId: ctx.chatId,
        userId: ctx.userId,
        username: ctx.username,
        text: ctx.text,
        supabase: ctx.supabase,
      })
      break

    case '/site':
      await replyMessage(chatId,
        `<b>Links do site</b>\n\n` +
        `<b>Site:</b> <a href="${SITE}">${SITE}</a>\n` +
        `<b>Admin:</b> <a href="${SITE}/admin">${SITE}/admin</a>\n` +
        `<b>Cursos:</b> <a href="${SITE}/cursos">${SITE}/cursos</a>`,
        { disablePreview: false }
      )
      break

    default:
      await replyMessage(chatId,
        `Comando <code>${command}</code> nao reconhecido.\n\nUse /ajuda para ver os comandos disponíveis.`
      )
  }
}

function buildHelp(nome: string): string {
  return [
    `Ola, <b>${nome}</b>! Sou o bot administrativo do G-Lab Cursos.`,
    '',
    '<b>Comandos disponiveis:</b>',
    '',
    '/dashboard  — Visao geral da plataforma',
    '/vendas     — Ultimas vendas e faturamento',
    '/cursos     — Cursos publicados',
    '/mensagens  — Mensagens de contato pendentes',
    '/v0 [msg]   — Falar com a IA do G-Lab',
    '/site       — Links rapidos do site',
    '/ajuda      — Esta mensagem',
  ].join('\n')
}
