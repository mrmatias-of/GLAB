import { replyMessage } from '@/lib/telegram'
import type { CommandContext } from '../commands'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://glabcursos.com.br'

export async function handleDashboard({ chatId, supabase }: CommandContext) {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const [
    { data: cursos },
    { data: vendasHoje },
    { data: vendasTotal },
    { data: alunos },
    { data: mensagens },
  ] = await Promise.all([
    supabase.from('cursos').select('id, ativo').eq('ativo', true),
    supabase.from('purchases').select('valor').eq('status', 'approved').gte('approved_at', hoje.toISOString()),
    supabase.from('purchases').select('valor').eq('status', 'approved'),
    supabase.from('profiles').select('id'),
    supabase.from('mensagens').select('id').eq('lida', false),
  ])

  const faturamentoHoje = (vendasHoje ?? []).reduce((s: number, v: { valor: number }) => s + Number(v.valor ?? 0), 0)
  const faturamentoTotal = (vendasTotal ?? []).reduce((s: number, v: { valor: number }) => s + Number(v.valor ?? 0), 0)

  const texto = [
    '<b>Dashboard — G-Lab Cursos</b>',
    '',
    `<b>Cursos ativos:</b> ${cursos?.length ?? 0}`,
    `<b>Alunos cadastrados:</b> ${alunos?.length ?? 0}`,
    `<b>Mensagens nao lidas:</b> ${mensagens?.length ?? 0}`,
    '',
    '<b>Financeiro</b>',
    `<b>Vendas hoje:</b> ${vendasHoje?.length ?? 0} — R$ ${faturamentoHoje.toFixed(2).replace('.', ',')}`,
    `<b>Faturamento total:</b> R$ ${faturamentoTotal.toFixed(2).replace('.', ',')}`,
    '',
    `<i>${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</i>`,
  ].join('\n')

  await replyMessage(chatId, texto, {
    buttons: [[
      { text: 'Abrir Painel', url: `${SITE}/admin` },
      { text: 'Ver Vendas',   url: `${SITE}/admin/vendas` },
    ]],
  })
}
