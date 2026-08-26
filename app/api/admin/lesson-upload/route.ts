import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { currentPlatformUser, isPlatformAdmin } from '@/lib/learning-platform'

// Upload client-side de vídeos/PDFs de aula direto para o Vercel Blob.
// Protegido: apenas admins autenticados podem gerar um token de upload.
export async function POST(request: Request): Promise<NextResponse> {
  const user = await currentPlatformUser()
  if (!user || !isPlatformAdmin(user.email)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'application/pdf',
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 2 * 1024 * 1024 * 1024, // 2GB
        }
      },
      // Sem onUploadCompleted: nada a persistir no servidor neste passo — o
      // cliente recebe a URL final do blob e a envia junto com o formulário
      // de criação/edição da aula, que grava content_url.
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Falha no upload.' },
      { status: 400 },
    )
  }
}
