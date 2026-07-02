import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'G•Lab - Assistência Técnica em Celulares',
  description: 'Aprenda assistência técnica mobile com guias profissionais e cursos práticos.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  )
}
