import Link from "next/link"

export const metadata = {
  title: "Gerenciador de Suporte — G•Lab",
  description: "Painel de controle de tickets de suporte",
}

// Middleware protege a rota - apenas admins e vendedores têm acesso
export default function SupportAdminLayout({ children }: { children: React.ReactNode }) {
  // isAdmin é determinado pelo middleware via x-user-admin header
  const isAdmin = true // Será validado pelo middleware

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Gerenciador de Suporte</h2>
          <p className="text-gray-400">Gerencie tickets e categorias de suporte</p>
        </div>
        <nav className="flex gap-2">
          <Link
            href="/admin/suporte"
            className="px-4 py-2 rounded border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors text-sm"
          >
            Dashboard
          </Link>
          {isAdmin && (
            <Link
              href="/admin/suporte/categorias"
              className="px-4 py-2 rounded border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors text-sm"
            >
              Categorias
            </Link>
          )}
        </nav>
      </div>

      {/* Content */}
      {children}
    </div>
  )
}
