import { replyMessage } from '@/lib/telegram'
import type { CommandContext } from '../commands'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://glabcursos.com.br'

export async function handleAlunos({ chatId, supabase }: CommandContext) {
  const { data: alunos } = await supabase
    .from('profiles')
    .select('id, nome, email, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  const { count: total } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  if (!alunos?.length) {
    await replyMessage(chatId, 'Nenhum aluno cadastrado ainda.')
    return
  }

  const linhas = alunos.map((a, i) => {
    const data = a.created_at
      ? new Date(a.created_at).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      : '-'
    return `${i + 1}. <b>${a.nome ?? 'Sem nome'}</b>\n   ${a.email} | ${data}`
  })

  const texto = [
    `<b>Ultimos 10 Alunos</b> (total: ${total ?? 0})`,
    '',
    ...linhas,
    '',
    `<i>${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</i>`,
  ].join('\n')

  await replyMessage(chatId, texto, {
    buttons: [[
      { text: 'Ver todos os alunos', url: `${SITE}/admin/alunos` },
    ]],
  })
}
