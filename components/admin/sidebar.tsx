"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Layers, BookOpen, LogOut, Home, LayoutDashboard, Receipt, Plus } from "lucide-react"

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
    <aside className="w-64 min-h-screen border-r flex flex-col" style={{ backgroundColor: '#0B0B0C', borderColor: '#27272a' }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: '#27272a' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border flex items-center justify-center" style={{ backgroundColor: '#1a1a1d', borderColor: '#27272a' }}>
            <Layers size={17} style={{ color: '#818cf8' }} strokeWidth={1.5} />
          </div>
          <div>
            <span className="font-black text-sm" style={{ color: '#fff' }}>G<span style={{ color: '#818cf8' }}>•</span>Lab</span>
            <p className="text-[10px] leading-none mt-0.5" style={{ color: '#71717a' }}>Admin</p>
          </div>
        </div>
      </div>

      {/* Botão Novo Curso destacado */}
      <div className="px-4 pb-2 pt-3">
        <Link
          href="/admin/cursos/novo"
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ backgroundColor: '#00d4c8', color: '#0B0B0C' }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Novo Curso
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active ? "border" : ""
              }`}
              style={{
                color: active ? '#818cf8' : '#71717a',
                backgroundColor: active ? '#1a1a1d' : 'transparent',
                borderColor: active ? '#27272a' : 'transparent',
              }}
            >
              <Icon size={16} strokeWidth={1.5} />
              {item.label}
            </Link>
          )
        })}

        <div className="mt-auto pt-4 border-t" style={{ borderColor: '#27272a' }}>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{ color: '#71717a' }}
          >
            <Home size={16} strokeWidth={1.5} />
            Ver Site
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="p-4 border-t" style={{ borderColor: '#27272a' }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs truncate" style={{ color: '#71717a' }}>{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg transition-all"
            style={{ color: '#71717a' }}
            title="Sair"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
