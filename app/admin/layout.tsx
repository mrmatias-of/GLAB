'use client'

import { usePathname, useRouter } from 'next/navigation'

import { PremiumSidebar } from '@/components/admin/premium-sidebar'
import { PremiumHeader } from '@/components/admin/premium-header'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Wrench,
  Package,
  Wallet,
  TrendingUp,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Ordens de Serviço', href: '/admin/ordens-servico', icon: ClipboardList },
  { name: 'Clientes', href: '/admin/clientes', icon: Users },
  { name: 'Técnicos', href: '/admin/tecnicos', icon: Wrench },
  { name: 'Estoque', href: '/admin/estoque', icon: Package },
  { name: 'Financeiro', href: '/admin/financeiro', icon: Wallet },
  { name: 'Relatórios', href: '/admin/relatorios', icon: TrendingUp },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('[Logout] Erro:', err)
    } finally {
      router.push('/login')
    }
  }

  const currentTitle =
    navigation.find((n) => pathname === n.href || pathname.startsWith(n.href + '/'))?.name ||
    'Painel'

  return (
    <div className="min-h-screen bg-white flex" style={{ backgroundColor: '#ffffff' }}>
      {/* Premium Sidebar */}
      <PremiumSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Premium Header */}
        <PremiumHeader title={currentTitle} />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
