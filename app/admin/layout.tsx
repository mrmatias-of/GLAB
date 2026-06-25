import AdminSidebar from "@/components/admin/sidebar"

export const metadata = {
  title: "Acesso Administrativo — G•Lab",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

// Middleware protege a rota - verificação adicional redundante pode ser adicionada aqui se necessário
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#050510' }}>
      <AdminSidebar userEmail="admin@glabcursos.com" />
      <main className="flex-1 overflow-auto relative">
        {/* Grid pattern no main */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,212,200,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,200,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        />
        {/* Linha neon superior decorativa */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
