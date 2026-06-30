import Link from "next/link"

export const metadata = {
  title: "Suporte — G•Lab",
  description: "Central de suporte para gerenciar seus tickets",
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  // Middleware protege a rota com JWT - não precisa verificar aqui

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050510' }}>
      {/* Header */}
      <header className="border-b border-cyan-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-cyan-400">Suporte G•Lab</h1>
            <p className="text-sm text-slate-400">Gerencie seus tickets de suporte</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/suporte/meus-tickets"
              className="px-4 py-2 rounded border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              Meus Tickets
            </Link>
            <Link
              href="/suporte/novo"
              className="px-4 py-2 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            >
              Novo Ticket
            </Link>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
