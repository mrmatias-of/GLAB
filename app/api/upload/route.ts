import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo fornecido' }, { status: 400 })
    }

    // Validar tipo de arquivo (apenas imagens)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use: JPG, PNG, WebP ou GIF' },
        { status: 400 }
      )
    }

    // Converter arquivo para buffer
    const buffer = await file.arrayBuffer()
    
    // Processar imagem com sharp
    // Redimensionar mantendo aspect ratio, máximo 1200px de largura
    const processedImage = await sharp(buffer)
      .resize(1200, 800, {
        fit: 'inside', // Mantém a imagem inteira sem cortar
        withoutEnlargement: true, // Não amplia imagens pequenas
      })
      .toFormat('webp', { quality: 80, progressive: true })
      .toBuffer()

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const filename = `cursos/${timestamp}.webp`

    // Upload para Vercel Blob (public)
    const blob = await put(filename, processedImage, {
      access: 'public',
      contentType: 'image/webp',
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 })
  }
}
