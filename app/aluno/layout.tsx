import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AlunoSidebar from "@/components/aluno/sidebar"

export const metadata = {
  title: "Minha Área — G•Lab",
}

export default async function AlunoLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login?next=/aluno")

  // Buscar perfil do aluno
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Contar notificações não lidas
  const { count: unreadNotifications } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false)

  return (
    <div className="min-h-screen bg-background flex">
      <AlunoSidebar 
        userName={profile?.nome || user.email || "Aluno"} 
        userEmail={user.email || ""}
        unreadCount={unreadNotifications || 0}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
