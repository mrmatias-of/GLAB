import { replyMessage } from '@/lib/telegram'
import type { CommandContext } from '../commands'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://glabcursos.com.br'

export async function handleMensagens({ chatId, supabase }: CommandContext) {
  const { data: mensagens } = await supabase
    .from('mensagens')
    .select('id, nome, email, mensagem, lida, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const { count: naoLidas } = await supabase
    .from('mensagens')
    .select('*', { count: 'exact', head: true })
    .eq('lida', false)

  if (!mensagens?.length) {
    await replyMessage(chatId, 'Nenhuma mensagem de contato ainda.')
    return
  }

  const linhas = mensagens.map((m, i) => {
    const status = m.lida ? 'Lida' : 'NAO LIDA'
    const data = m.created_at
      ? new Date(m.created_at).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      : '-'
    const preview = (m.mensagem ?? '').slice(0, 80).replace(/\n/g, ' ')
    return `${i + 1}. <b>${m.nome}</b> | ${status} | ${data}\n   ${m.email}\n   "${preview}${(m.mensagem ?? '').length > 80 ? '...' : ''}"`
  })

  const texto = [
    `<b>Mensagens de Contato</b> (${naoLidas ?? 0} nao lidas)`,
    '',
    ...linhas,
    '',
    `<i>${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</i>`,
  ].join('\n')

  await replyMessage(chatId, texto, {
    buttons: [[
      { text: 'Ver todas as mensagens', url: `${SITE}/admin/mensagens` },
    ]],
  })
}
