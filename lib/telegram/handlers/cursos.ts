import { replyMessage } from '@/lib/telegram'
import type { CommandContext } from '../commands'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://glabcursos.com.br'

export async function handleCursos({ chatId, supabase }: CommandContext) {
  const { data: cursos } = await supabase
    .from('cursos')
    .select('id, titulo, preco, ativo, destaque, slug')
    .order('ordem', { ascending: true })

  if (!cursos?.length) {
    await replyMessage(chatId, 'Nenhum curso cadastrado.')
    return
  }

  const ativos    = cursos.filter(c => c.ativo).length
  const inativos  = cursos.filter(c => !c.ativo).length
  const destaques = cursos.filter(c => c.destaque).length

  const linhas = cursos.map((c, i) => {
    const status   = c.ativo ? 'Ativo' : 'Inativo'
    const destaque = c.destaque ? ' | Destaque' : ''
    return `${i + 1}. <b>${c.titulo}</b>\n   ${c.preco} | ${status}${destaque}`
  })

  const texto = [
    `<b>Cursos Cadastrados</b> (${cursos.length} total)`,
    `Ativos: ${ativos} | Inativos: ${inativos} | Destaques: ${destaques}`,
    '',
    ...linhas,
    '',
    `<i>${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</i>`,
  ].join('\n')

  await replyMessage(chatId, texto, {
    buttons: [[
      { text: 'Gerenciar cursos', url: `${SITE}/admin/cursos` },
      { text: 'Novo curso',       url: `${SITE}/admin/cursos/novo` },
    ]],
  })
}
