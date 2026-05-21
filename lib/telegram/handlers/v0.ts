import { SupabaseClient } from '@supabase/supabase-js'
import { replyMessage } from '@/lib/telegram'
import { generateText } from 'ai'
import { gateway } from '@ai-sdk/gateway'

interface CommandContext {
  chatId: number
  userId: number
  username?: string
  text: string
  supabase: SupabaseClient
}

const SYSTEM_PROMPT = `Voce e o assistente oficial do G-Lab, uma plataforma de cursos de manutencao de celulares.

Voce pode ajudar com:
- Duvidas sobre o sistema (painel admin, cursos, vendas)
- Sugestoes de melhorias
- Resolver problemas tecnicos
- Criar conteudo para cursos
- Gerar textos de marketing
- Qualquer outra tarefa relacionada ao negocio

Responda sempre em portugues brasileiro, de forma direta e util.
Use formatacao HTML do Telegram quando apropriado:
- <b>negrito</b> para destacar
- <code>codigo</code> para termos tecnicos
- Listas com • para organizar

Seja conciso mas completo. Maximo 3 paragrafos por resposta.`

export async function handleV0(ctx: CommandContext): Promise<void> {
  const { chatId, text } = ctx
  
  // Extrair a mensagem apos o comando /v0
  const userMessage = text.replace(/^\/v0\s*/i, '').trim()
  
  if (!userMessage) {
    await replyMessage(chatId, [
      '<b>Como usar o /v0:</b>',
      '',
      'Envie uma mensagem junto com o comando:',
      '<code>/v0 sua pergunta ou tarefa aqui</code>',
      '',
      '<b>Exemplos:</b>',
      '• /v0 crie uma descricao para um curso de troca de tela',
      '• /v0 quais melhorias posso fazer no site?',
      '• /v0 me ajude a resolver um bug no painel',
    ].join('\n'))
    return
  }

  // Avisar que esta processando
  await replyMessage(chatId, '⏳ Processando...')

  try {
    const { text: response } = await generateText({
      model: gateway('openai/gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      prompt: userMessage,
      maxTokens: 1000,
    })

    // Enviar resposta
    await replyMessage(chatId, response || 'Desculpe, nao consegui processar sua solicitacao.')

  } catch (error: any) {
    console.error('[v0] Erro ao gerar resposta:', error?.message || error)
    await replyMessage(chatId, [
      '❌ <b>Erro ao processar</b>',
      '',
      `Erro: ${error?.message || 'Desconhecido'}`,
      '',
      'Tente novamente em alguns instantes.',
    ].join('\n'))
  }
}
