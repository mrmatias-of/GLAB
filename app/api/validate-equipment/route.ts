import { Anthropic } from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { imageBase64, recognizedText, equipment, serial } = await req.json()

    if (!imageBase64 && !recognizedText) {
      return Response.json(
        { error: 'Image or recognized text required' },
        { status: 400 }
      )
    }

    const systemPrompt = `Você é um especialista em identificar equipamentos eletrônicos (telefones, notebooks, tablets, smartwatches, etc).

Responda SEMPRE em JSON válido com a seguinte estrutura exata (sem markdown, apenas JSON):
{
  "isValid": true/false,
  "brand": "marca correta",
  "model": "modelo correto",
  "serialNumber": "número de série se identificável ou null",
  "variant": "descrição de variação (cor, storage, etc) se identificável ou null",
  "confidence": "high/medium/low",
  "notes": "observações ou correções realizadas"
}

Se o equipamento não for identificável ou parecer fraudulento, marque isValid como false.`

    const messages: any[] = []

    // Se temos imagem, usar visão com Claude
    if (imageBase64) {
      const imagePrompt = `Analise esta imagem de um equipamento e identifique:
1. Marca (Apple, Samsung, LG, Xiaomi, etc)
2. Modelo exato (iPhone 14 Pro, Galaxy S23 Ultra, etc)
3. Número de série (se visível)
4. Variação (cor, capacidade de armazenamento, etc)

Seja preciso e seguro apenas em informações que conseguir identificar claramente da imagem.`

      messages.push({
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: imagePrompt,
          },
        ],
      })
    } else {
      // Se temos apenas texto do OCR
      const textPrompt = `Baseado no texto reconhecido do equipamento, identifique corretamente:
Texto reconhecido: "${recognizedText}"
Equipamento informado: "${equipment || 'não informado'}"
Série informada: "${serial || 'não informada'}"

Valide se o modelo está correto e corrija se necessário. Busque identificar a marca e modelo mesmo que o texto seja parcial.`

      messages.push({
        role: 'user',
        content: textPrompt,
      })
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    })

    // Extrair o conteúdo da resposta
    const content = response.content[0]
    if (content.type !== 'text') {
      return Response.json({ error: 'Invalid response format' }, { status: 500 })
    }

    // Limpar markdown se houver
    let jsonText = content.text
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0].trim()
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1].split('```')[0].trim()
    }

    const validationResult = JSON.parse(jsonText)

    return Response.json({
      success: true,
      validation: validationResult,
      rawResponse: content.text,
    })
  } catch (error) {
    console.error('[v0] Equipment validation error:', error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Validation failed',
      },
      { status: 500 }
    )
  }
}
