"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { BookOpen, LogOut, Home, LayoutDashboard, Receipt, Plus } from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Cursos", href: "/admin/cursos", icon: BookOpen },
  { label: "Vendas", href: "/admin/vendas", icon: Receipt },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    }
    router.push("/login")
    router.refresh()
  }

  return (
    <aside 
      className="w-64 min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#050510' }}
    >
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,200,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,200,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Borda direita neon */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-violet-500/30 to-transparent" />
      
      {/* Logo com imagem real */}
      <div className="p-6 border-b border-cyan-500/10 relative z-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="flex items-center gap-3 relative">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-glab-neon-transparent-2kFvS2C6hGbJR8B91q0a0cgSa9Uqxz.png"
              alt="G-Lab Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="font-black text-base text-white">G<span className="text-cyan-400" style={{ textShadow: '0 0 10px rgba(0,212,200,0.8)' }}>•</span>LAB</span>
            <p className="text-[10px] leading-none mt-0.5 text-cyan-500/50 font-medium tracking-wider">ADMIN PANEL</p>
          </div>
        </div>
      </div>

      {/* Botao Novo Curso destacado */}
      <div className="px-4 py-4 relative z-10">
        <Link
          href="/admin/cursos/novo"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105"
          style={{ 
            background: 'linear-gradient(135deg, #00d4c8 0%, #7c3aed 100%)',
            boxShadow: '0 0 20px rgba(0,212,200,0.3)'
          }}
        >
          <Plus size={16} strokeWidth={2.5} className="text-black" />
          <span className="text-black">Novo Curso</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 flex flex-col gap-1 relative z-10">
        <p className="text-[10px] text-cyan-500/40 font-bold tracking-wider uppercase mb-2 px-3">Menu</p>
        
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                active 
                  ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30" 
                  : "text-white/50 hover:text-cyan-400 hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/20"
              }`}
              style={active ? { boxShadow: '0 0 15px rgba(0,212,200,0.2)' } : {}}
            >
              {active && (
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                  style={{ background: 'linear-gradient(180deg, #00d4c8 0%, #7c3aed 100%)' }}
                />
              )}
              <Icon size={16} strokeWidth={1.5} />
              {item.label}
            </Link>
          )
        })}

        <div className="mt-6 pt-4 border-t border-cyan-500/10">
          <p className="text-[10px] text-cyan-500/40 font-bold tracking-wider uppercase mb-2 px-3">Sistema</p>
          
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-white/50 hover:text-cyan-400 hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/20"
          >
            <Home size={16} strokeWidth={1.5} />
            Ver Site
          </Link>
        </div>
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-cyan-500/10 mt-auto relative z-10">
        <div 
          className="flex items-center gap-3 p-3 rounded-xl border border-violet-500/20"
          style={{ background: 'rgba(124, 58, 237, 0.05)' }}
        >
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ 
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              boxShadow: '0 0 15px rgba(124, 58, 237, 0.3)'
            }}
          >
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white font-medium truncate">{userEmail.split('@')[0]}</p>
            <p className="text-[10px] text-violet-400/50 truncate">Administrador</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg transition-all duration-300 text-white/30 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
            title="Sair"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
