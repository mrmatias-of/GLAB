import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import WhatsAppButton from '@/components/whatsapp-button'
import { setupErrorHandler } from '@/lib/error-handler'
import './globals.css'

// Inicializar tratador de erros
if (typeof window === 'undefined') {
  setupErrorHandler()
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'G•Lab Cursos — Guias Mestre',
    template: '%s | G•Lab Cursos',
  },
  description: 'Guias técnicos práticos criados por quem já reparou mais de 20 mil aparelhos. Aprenda os métodos que funcionam de verdade no dia a dia da assistência técnica.',
  keywords: 'curso reparo iPhone, curso reparo Android, assistência técnica, guia técnico, G•Lab Cursos',
  authors: [{ name: 'G•Lab Cursos' }],
  creator: 'G•Lab Cursos',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://glabcursos.com.br',
    siteName: 'G•Lab Cursos',
    title: 'G•Lab Cursos — Guias Mestre',
    description: 'Guias técnicos práticos criados por quem já reparou mais de 20 mil aparelhos.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'G•Lab Cursos — Guias Mestre',
    description: 'Guias técnicos práticos de assistência técnica.',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`} style={{ backgroundColor: '#0B0B0C' }}>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <WhatsAppButton />
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
