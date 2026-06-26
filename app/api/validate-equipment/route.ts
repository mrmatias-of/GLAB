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

    let prompt = `Você é um especialista em equipamentos eletrônicos (telefones, notebooks, tablets, etc).

Analise as informações fornecidas e identifique o equipamento corretamente.

`

    const messages: any[] = []

    // Se temos imagem, usar visão
    if (imageBase64) {
      prompt += `A imagem mostra um equipamento. Identifique corretamente:
1. Marca (Apple, Samsung, LG, etc)
2. Modelo exato (iPhone 14 Pro, Galaxy S23, etc)
3. Número de série (se visível)
4. Variação de cor/storage (se identificável)

`
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
            text: prompt,
          },
        ],
      })
    } else {
      // Se temos apenas texto do OCR
      prompt += `Baseado no texto reconhecido do equipamento:
Texto reconhecido: "${recognizedText}"
Equipamento informado: "${equipment}"
Série informada: "${serial}"

Valide se o modelo está correto e corrija se necessário.
`
      messages.push({
        role: 'user',
        content: prompt,
      })
    }

    prompt += `

Responda em JSON com a seguinte estrutura (APENAS JSON válido, sem markdown):
{
  "isValid": true/false,
  "brand": "marca correta",
  "model": "modelo correto",
  "serialNumber": "número de série se identificável ou null",
  "variant": "descrição de variação (cor, storage, etc) se identificável",
  "confidence": "high/medium/low",
  "notes": "observações ou correções realizadas"
}

Se o equipamento não for identificável ou parecer fraudulento, marque isValid como false.
`

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
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
