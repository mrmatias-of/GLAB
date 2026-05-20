import { createClient } from "@/lib/supabase/server"
import { Bell, CheckCircle, Trash2 } from "lucide-react"

export default async function NotificacoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  const unreadCount = notifications?.filter(n => !n.read).length || 0

  return (
    <div className="p-8">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
            <Bell size={28} className="text-cyan" />
            Notificações
          </h1>
          {unreadCount > 0 && (
            <span className="bg-cyan text-background text-sm font-bold px-3 py-1 rounded-full">
              {unreadCount} novo{unreadCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {notifications && notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notif: any) => (
              <div 
                key={notif.id}
                className={`rounded-2xl border p-4 flex items-start justify-between transition-all ${
                  notif.read 
                    ? "border-border bg-surface/50" 
                    : "border-cyan/30 bg-cyan/5"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{notif.title}</p>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-cyan"></span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notif.created_at).toLocaleDateString("pt-BR")} às{" "}
                    {new Date(notif.created_at).toLocaleTimeString("pt-BR", { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </p>
                </div>
                <button className="p-2 rounded-lg border border-border hover:border-red-500/30 hover:text-red-400 transition-all ml-4">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Bell size={48} className="text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Nenhuma notificação</p>
            <p className="text-sm text-muted-foreground mt-2">Você verá notificações sobre seus cursos aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}
