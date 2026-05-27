import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | G•Lab Cursos',
  description: 'Acesse sua conta G•Lab para continuar com os cursos',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
