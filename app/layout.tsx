import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { VisitorTracker } from '@/components/visitor-tracker'
import { SiteOverlays } from '@/components/site-overlays'
import { PrivacyBannerWrapper } from '@/components/privacy-banner-wrapper'
import { ConditionalAnalytics } from '@/components/conditional-analytics'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
})

const SITE_URL = 'https://www.glabcursos.com.br'
const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'G•Lab Cursos | Guias Técnicos para Assistência Mobile',
    template: '%s | G•Lab Cursos',
  },
  description: 'Aprenda reparos em celulares com guias técnicos práticos para troca de tela, bateria, conectores, software e diagnóstico em bancada.',
  keywords: 'curso reparo iPhone, curso reparo Android, assistência técnica, guia técnico, G•Lab Cursos',
  authors: [{ name: 'G•Lab Cursos' }],
  creator: 'G•Lab Cursos',
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: '/logo-glab-neon-transparent.png',
    shortcut: '/logo-glab-neon-transparent.png',
  },
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
    url: SITE_URL,
    siteName: 'G•Lab Cursos',
    title: 'G•Lab Cursos | Guias Técnicos para Assistência Mobile',
    description: 'Aprenda reparos em celulares com guias técnicos práticos para troca de tela, bateria, conectores, software e diagnóstico em bancada.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'G•Lab Cursos — Guias técnicos para assistência mobile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'G•Lab Cursos | Guias Técnicos para Assistência Mobile',
    description: 'Aprenda reparos em celulares com guias técnicos práticos para troca de tela, bateria, conectores, software e diagnóstico em bancada.',
    images: [OG_IMAGE],
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html { background-color: #0B0F19; color: #F1F5F9; scroll-behavior: smooth; }
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #0B0F19; color: #F1F5F9; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
          a { color: #3B82F6; text-decoration: none; }
          button { cursor: pointer; font-family: inherit; }
          h1, h2, h3, h4, h5, h6 { font-weight: 600; letter-spacing: -0.01em; }
          h1 { font-size: 2rem; }
          h2 { font-size: 1.5rem; }
          h3 { font-size: 1.25rem; }
        `}</style>
      </head>
      <body className="font-sans antialiased bg-slate-950" style={{ backgroundColor: '#0B0F19' }}>
        <VisitorTracker />
        <SiteOverlays />
        {children}
        <PrivacyBannerWrapper />
        {process.env.NODE_ENV === 'production' && <ConditionalAnalytics />}
      </body>
    </html>
  )
}
