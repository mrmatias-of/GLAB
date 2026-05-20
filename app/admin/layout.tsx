import { createClient } from "@/lib/supabase/server"
import AdminSidebar from "@/components/admin/sidebar"

export const metadata = {
  title: "Admin — G•Lab",
}

// Middleware já garante que o usuário está autenticado antes de chegar aqui
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar userEmail={user?.email ?? ""} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
