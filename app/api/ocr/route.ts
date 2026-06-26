import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: 'Imagem não fornecida' }, { status: 400 })
    }

    // Usar Google Cloud Vision API
    // Para funcionar, você precisa de uma chave de API configurada em GOOGLE_VISION_API_KEY
    const apiKey = process.env.GOOGLE_VISION_API_KEY

    if (!apiKey) {
      // Fallback: retornar texto vazio para indicar que OCR não está configurado
      console.warn('[v0] GOOGLE_VISION_API_KEY não configurada')
      return NextResponse.json({ text: '' }, { status: 200 })
    }

    // Remover prefixo data:image/jpeg;base64, se existir
    const base64Data = image.split(',')[1] || image

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotateRequest?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: { content: base64Data },
              features: [{ type: 'TEXT_DETECTION' }],
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Erro na API de Vision')
    }

    const data = await response.json()

    // Extrair texto reconhecido
    const text = data.responses?.[0]?.fullTextAnnotation?.text || ''

    return NextResponse.json({ text })
  } catch (error) {
    console.error('[v0] OCR error:', error)
    return NextResponse.json(
      { error: 'Erro ao processar imagem', text: '' },
      { status: 500 }
    )
  }
}
