"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  Layers, BookOpen, LogOut, Home, User, Bell, Award, Settings 
} from "lucide-react"

const navItems = [
  { label: "Meus Cursos", href: "/aluno", icon: BookOpen },
  { label: "Certificados", href: "/aluno/certificados", icon: Award },
  { label: "Minha Conta", href: "/aluno/minha-conta", icon: User },
]

type Props = {
  userName: string
  userEmail: string
  unreadCount: number
}

export default function AlunoSidebar({ userName, userEmail, unreadCount }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <Layers className="w-6 h-6 text-cyan" />
        <span className="text-lg font-black tracking-tight">
          G<span className="text-cyan">•</span>Lab
        </span>
      </Link>

      {/* User info */}
      <div className="px-6 py-4 border-b border-border">
        <p className="font-semibold text-foreground text-sm truncate">{userName}</p>
        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== "/aluno" && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-cyan/10 text-cyan" 
                    : "text-muted-foreground hover:text-foreground hover:bg-surface"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}

          {/* Notificações com badge */}
          <Link
            href="/aluno/notificacoes"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              pathname === "/aluno/notificacoes"
                ? "bg-cyan/10 text-cyan" 
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <Bell size={18} />
            Notificações
            {unreadCount > 0 && (
              <span className="ml-auto bg-cyan text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-all"
        >
          <Home size={18} />
          Voltar ao Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  )
}
