import { createClient } from "@/lib/supabase/server"
import { User, Mail, Phone, Calendar } from "lucide-react"

export default async function MinhaContaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-black text-foreground mb-8 flex items-center gap-3">
          <User size={28} className="text-cyan" />
          Minha Conta
        </h1>

        {/* Perfil do Usuário */}
        <div className="rounded-2xl border border-border bg-card p-8 mb-8">
          <div className="grid gap-6">
            <div>
              <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                Nome Completo
              </label>
              <p className="text-lg font-medium text-foreground mt-2">{profile?.nome || "Não preenchido"}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                  <Mail size={14} />
                  Email
                </label>
                <p className="text-foreground mt-2">{user?.email}</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                  <Phone size={14} />
                  Telefone
                </label>
                <p className="text-foreground mt-2">{profile?.telefone || "Não preenchido"}</p>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                <Calendar size={14} />
                Membro desde
              </label>
              <p className="text-foreground mt-2">
                {profile?.created_at 
                  ? new Date(profile.created_at).toLocaleDateString("pt-BR")
                  : "—"
                }
              </p>
            </div>
          </div>

          <button className="mt-8 inline-flex items-center px-6 py-2.5 rounded-xl bg-cyan text-background font-bold text-sm hover:bg-cyan/90 transition-all">
            Editar Perfil
          </button>
        </div>

        {/* Informações de Segurança */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <h2 className="text-lg font-black text-foreground mb-6">Segurança</h2>
          <button className="inline-flex items-center px-6 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:border-cyan/30 hover:text-cyan transition-all">
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  )
}
