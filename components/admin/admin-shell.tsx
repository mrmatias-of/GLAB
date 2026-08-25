'use client'

import { usePathname, useRouter } from 'next/navigation'
import { PremiumSidebar } from '@/components/admin/premium-sidebar'
import { PremiumHeader } from '@/components/admin/premium-header'
import { signOut } from '@/lib/auth-client'
import { LayoutDashboard, ClipboardList, Users, Wrench, Package, Wallet, TrendingUp } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Ordens de Serviço', href: '/admin/ordens-servico', icon: ClipboardList },
  { name: 'Clientes', href: '/admin/clientes', icon: Users },
  { name: 'Técnicos', href: '/admin/tecnicos', icon: Wrench },
  { name: 'Estoque', href: '/admin/estoque', icon: Package },
  { name: 'Financeiro', href: '/admin/financeiro', icon: Wallet },
  { name: 'Relatórios', href: '/admin/relatorios', icon: TrendingUp },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const currentTitle = navigation.find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`))?.name ?? 'Painel'

  const handleLogout = async () => {
    await signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <PremiumSidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <PremiumHeader title={currentTitle} onLogout={handleLogout} />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto"><div className="max-w-7xl mx-auto w-full">{children}</div></main>
      </div>
    </div>
  )
}
