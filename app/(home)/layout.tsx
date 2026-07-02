import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'G•Lab | Guias Técnicos e Cursos de Reparo',
  description: 'Plataforma de conhecimento técnico com cursos sobre reparo e manutenção de dispositivos eletrônicos',
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {children}
    </div>
  )
}
