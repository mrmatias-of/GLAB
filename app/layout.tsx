import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'G•Hub Cursos — Guias Mestre',
  description: 'Guias técnicos práticos criados por quem já reparou mais de 20 mil aparelhos. Aprenda os métodos que funcionam de verdade no dia a dia da assistência técnica.',
  keywords: 'curso reparo iPhone, curso reparo Android, assistência técnica, guia técnico, Guilherme Julião',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
