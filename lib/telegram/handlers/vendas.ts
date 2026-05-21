import { replyMessage } from '@/lib/telegram'
import type { CommandContext } from '../commands'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://glabcursos.com.br'

export async function handleVendas({ chatId, supabase }: CommandContext) {
  const { data: vendas } = await supabase
    .from('purchases')
    .select('id, email_comprador, valor, status, metodo_pagamento, approved_at, cursos(titulo)')
    .order('created_at', { ascending: false })
    .limit(10)

  if (!vendas?.length) {
    await replyMessage(chatId, 'Nenhuma venda registrada ainda.')
    return
  }

  const aprovadas = vendas.filter(v => v.status === 'approved')
  const total = aprovadas.reduce((s, v) => s + Number(v.valor ?? 0), 0)

  const linhas = vendas.map((v, i) => {
    const status = v.status === 'approved' ? 'Aprovado' : v.status === 'refunded' ? 'Reembolso' : v.status === 'pending' ? 'Pendente' : v.status
    const valor  = v.valor ? `R$ ${Number(v.valor).toFixed(2).replace('.', ',')}` : '-'
    const curso  = (v.cursos as unknown as { titulo: string } | null)?.titulo ?? 'Curso'
    return `${i + 1}. <b>${curso}</b>\n   ${v.email_comprador ?? '-'} | ${valor} | ${status}`
  })

  const texto = [
    '<b>Ultimas 10 Vendas</b>',
    '',
    ...linhas,
    '',
    `<b>Total aprovado (nas 10):</b> R$ ${total.toFixed(2).replace('.', ',')}`,
    '',
    `<i>${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</i>`,
  ].join('\n')

  await replyMessage(chatId, texto, {
    buttons: [[
      { text: 'Ver todas as vendas', url: `${SITE}/admin/vendas` },
    ]],
  })
}
