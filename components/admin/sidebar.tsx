"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Layers, BookOpen, LogOut, Home, LayoutDashboard, Receipt, Plus, Zap, Settings } from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Cursos", href: "/admin/cursos", icon: BookOpen },
  { label: "Vendas", href: "/admin/vendas", icon: Receipt },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <aside 
      className="w-64 min-h-screen border-r border-zinc-800/50 flex flex-col"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0d12 100%)' }}
    >
      {/* Logo com glow */}
      <div className="p-6 border-b border-zinc-800/50 relative">
        <div className="absolute top-0 left-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl" />
        <div className="flex items-center gap-3 relative">
          <div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20"
          >
            <Zap size={18} className="text-black" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-black text-base text-white">G<span className="text-cyan-400">•</span>LAB</span>
            <p className="text-[10px] leading-none mt-0.5 text-zinc-600 font-medium tracking-wider">ADMIN PANEL</p>
          </div>
        </div>
      </div>

      {/* Botao Novo Curso destacado */}
      <div className="px-4 py-4">
        <Link
          href="/admin/cursos/novo"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all bg-gradient-to-r from-cyan-500 to-teal-500 text-black hover:shadow-lg hover:shadow-cyan-500/30"
        >
          <Plus size={16} strokeWidth={2.5} />
          Novo Curso
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 flex flex-col gap-1">
        <p className="text-[10px] text-zinc-600 font-bold tracking-wider uppercase mb-2 px-3">Menu</p>
        
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                active 
                  ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30" 
                  : "text-zinc-500 hover:text-white hover:bg-zinc-800/50 border border-transparent"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-gradient-to-b from-cyan-400 to-teal-500 rounded-r-full" />
              )}
              <Icon size={16} strokeWidth={1.5} />
              {item.label}
            </Link>
          )
        })}

        <div className="mt-6 pt-4 border-t border-zinc-800/50">
          <p className="text-[10px] text-zinc-600 font-bold tracking-wider uppercase mb-2 px-3">Sistema</p>
          
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-zinc-500 hover:text-white hover:bg-zinc-800/50"
          >
            <Home size={16} strokeWidth={1.5} />
            Ver Site
          </Link>
        </div>
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-zinc-800/50 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-violet-500/20">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white font-medium truncate">{userEmail.split('@')[0]}</p>
            <p className="text-[10px] text-zinc-600 truncate">Administrador</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg transition-all text-zinc-600 hover:text-red-400 hover:bg-red-500/10"
            title="Sair"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
