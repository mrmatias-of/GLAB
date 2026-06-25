export const dynamic = 'force-dynamic'

export default function AdminPage() {
  return (
    <div className="min-h-screen p-8" style={{ background: '#050510' }}>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Painel Admin</h1>
        <p className="text-white/40">Bem-vindo ao painel administrativo da G•Lab</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <a href="/admin/cursos" className="block border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500/60 transition-colors" style={{ background: 'rgba(0,212,200,0.03)' }}>
          <h2 className="text-xl font-bold text-white mb-2">Cursos</h2>
          <p className="text-white/60">Gerenciar cursos da plataforma</p>
        </a>

        <a href="/admin/suporte" className="block border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500/60 transition-colors" style={{ background: 'rgba(0,212,200,0.03)' }}>
          <h2 className="text-xl font-bold text-white mb-2">Suporte</h2>
          <p className="text-white/60">Gerenciar tickets de suporte</p>
        </a>
      </div>
    </div>
  )
}
