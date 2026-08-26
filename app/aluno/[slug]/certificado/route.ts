import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { currentPlatformUser, ensureCertificate } from '@/lib/learning-platform'

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const user = await currentPlatformUser()
  if (!user) {
    return NextResponse.redirect(new URL('/sign-in', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'))
  }

  let certificate
  try {
    certificate = await ensureCertificate(slug, user.email)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível emitir o certificado.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([842, 595]) // A4 paisagem em pt
  const { width, height } = page.getSize()

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const ink = rgb(0.06, 0.09, 0.14)
  const accent = rgb(0.18, 0.63, 0.87)
  const muted = rgb(0.42, 0.46, 0.52)

  // Moldura
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: accent,
    borderWidth: 2,
  })
  page.drawRectangle({
    x: 40,
    y: 40,
    width: width - 80,
    height: height - 80,
    borderColor: muted,
    borderWidth: 0.75,
  })

  const centerText = (text: string, y: number, font = fontRegular, size = 12, color = ink) => {
    const textWidth = font.widthOfTextAtSize(text, size)
    page.drawText(text, { x: (width - textWidth) / 2, y, font, size, color })
  }

  centerText('G·LAB CURSOS', height - 100, fontBold, 16, accent)
  centerText('CERTIFICADO DE CONCLUSÃO', height - 130, fontBold, 26, ink)

  centerText('Certificamos que', height - 190, fontRegular, 13, muted)
  centerText(certificate.studentName, height - 225, fontBold, 28, ink)

  const courseLine = 'concluiu com êxito a formação'
  centerText(courseLine, height - 265, fontRegular, 13, muted)
  centerText(certificate.courseTitle, height - 300, fontBold, 20, accent)

  const issuedDate = certificate.issuedAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  centerText(`Emitido em ${issuedDate}`, height - 340, fontRegular, 12, muted)

  centerText(`Código de verificação: ${certificate.code}`, 70, fontRegular, 10, muted)

  const pdfBytes = await pdfDoc.save()

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificado-${slug}.pdf"`,
    },
  })
}
