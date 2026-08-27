'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import {
  LayoutDashboard,
  BookOpen,
  Package,
  Users,
  GraduationCap as EnrollmentIcon,
  TrendingUp,
  Ticket,
  Settings,
  GraduationCap,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const navigation = [
  { name: 'Início', href: '/admin', icon: LayoutDashboard },
  { name: 'Cursos', href: '/admin/cursos', icon: BookOpen },
  { name: 'Combos', href: '/admin/combos', icon: Package },
  { name: 'Alunos', href: '/admin/alunos', icon: Users },
  { name: 'Matrículas', href: '/admin/matriculas', icon: EnrollmentIcon },
  { name: 'Vendas', href: '/admin/vendas', icon: TrendingUp },
  { name: 'Cupons', href: '/admin/cupons', icon: Ticket },
  { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentTitle =
    navigation.find((n) => pathname === n.href || (n.href !== '/admin' && pathname.startsWith(`${n.href}/`)))?.name ?? 'Painel'

  const handleLogout = async () => {
    await signOut()
    router.push('/sign-in')
    router.refresh()
  }

  const NavLinks = () => (
    <nav className="flex flex-col gap-1 px-3">
      {navigation.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={
              isActive
                ? 'flex items-center gap-3 rounded-xl bg-cyan-400/10 px-3 py-2.5 text-sm font-bold text-cyan-300'
                : 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white'
            }
          >
            <Icon size={18} />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-white/10 bg-[#080b16] lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-5 py-6 font-black tracking-tight text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600">
            <GraduationCap size={19} />
          </span>
          G·LAB <span className="text-xs font-bold text-cyan-300">ADMIN</span>
        </Link>
        <div className="flex-1 overflow-y-auto py-2">
          <NavLinks />
        </div>
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-[#080b16]">
            <div className="flex items-center justify-between px-5 py-6">
              <span className="font-black tracking-tight text-white">G·LAB ADMIN</span>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white" aria-label="Fechar menu">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <NavLinks />
            </div>
            <div className="border-t border-white/10 p-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex flex-col lg:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-950/85 px-4 py-4 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-slate-300 hover:text-white lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-bold text-white">{currentTitle}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:border-cyan-300/50 hover:text-cyan-200 lg:flex"
          >
            <LogOut size={15} />
            Sair
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
