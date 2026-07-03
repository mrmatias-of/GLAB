import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'G-Lab — Enterprise Repair Platform',
  description: 'Plataforma profissional de assistência técnica mobile.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-white dark:bg-[#09090B] antialiased">
        {children}
      </body>
    </html>
  )
}
