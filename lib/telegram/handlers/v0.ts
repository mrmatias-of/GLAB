import { SupabaseClient } from '@supabase/supabase-js'
import { replyMessage } from '@/lib/telegram'

interface CommandContext {
  chatId: number
  userId: number
  username?: string
  text: string
  supabase: SupabaseClient
}

const SYSTEM_PROMPT = `Voce e o assistente oficial do G-Lab, uma plataforma de cursos de manutencao de celulares.

Responda sempre em portugues brasileiro, de forma direta e util.`

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
  await replyMessage(chatId, '⏳ Processando sua requisicao com IA...')

  try {
    // Verificar se tem API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY nao configurada')
    }

    // Chamada direta à API OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content

    if (!aiResponse) {
      throw new Error('Nenhuma resposta gerada')
    }

    // Enviar resposta
    await replyMessage(chatId, aiResponse)

  } catch (error: any) {
    console.error('[v0] Erro ao gerar resposta:', error?.message || error)
    await replyMessage(chatId, [
      '❌ <b>Erro ao processar</b>',
      '',
      `Erro: ${error?.message || 'Desconhecido'}`,
      '',
      'Certifique-se que:',
      '• Variável OPENAI_API_KEY esta configurada',
      '• Voce tem credito na OpenAI',
      '• Tente novamente em alguns instantes',
    ].join('\n'))
  }
}
