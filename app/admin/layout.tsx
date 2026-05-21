import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/sidebar"

export const metadata = {
  title: "Admin — G•Lab",
}

// Segunda camada de proteção: verifica role diretamente no servidor
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Bloqueia no servidor caso o middleware seja bypassado
  if (!user || user.user_metadata?.is_admin !== true) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0B0B0C' }}>
      <AdminSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
