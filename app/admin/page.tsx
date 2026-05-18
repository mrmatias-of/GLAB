import { createClient } from "@/lib/supabase/server"
import { BookOpen, Star, TrendingUp, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: cursos } = await supabase.from("cursos").select("*").order("ordem")

  const total = cursos?.length ?? 0
  const destaques = cursos?.filter((c) => c.destaque).length ?? 0
  const comCheckout = cursos?.filter((c) => c.cta_href && c.cta_href !== "#").length ?? 0
  const ativos = cursos?.filter((c) => c.ativo).length ?? 0

  const stats = [
    { label: "Total de Guias", value: total, icon: BookOpen, color: "text-cyan" },
    { label: "Em Destaque", value: destaques, icon: Star, color: "text-gold" },
    { label: "Com Checkout", value: comCheckout, icon: LinkIcon, color: "text-green-400" },
    { label: "Ativos", value: ativos, icon: TrendingUp, color: "text-blue-400" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral da plataforma G•Lab</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon size={18} className={s.color} strokeWidth={1.5} />
              </div>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Cursos recentes */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-black text-foreground">Guias Cadastrados</h2>
          <Link
            href="/admin/cursos/novo"
            className="text-xs font-bold bg-cyan text-background px-4 py-2 rounded-xl hover:bg-cyan/90 transition-colors"
          >
            + Novo Guia
          </Link>
        </div>
        <div className="divide-y divide-border">
          {cursos?.map((curso) => (
            <div key={curso.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${curso.ativo ? "bg-cyan" : "bg-muted-foreground"}`} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{curso.titulo}</p>
                  <p className="text-xs text-muted-foreground">{curso.tag} · {curso.preco}</p>
                </div>
                {curso.destaque && (
                  <span className="text-[10px] font-black bg-cyan/15 text-cyan border border-cyan/20 px-2 py-0.5 rounded-full">
                    DESTAQUE
                  </span>
                )}
              </div>
              <Link
                href={`/admin/cursos/editar/${curso.id}`}
                className="text-xs font-medium text-muted-foreground hover:text-cyan border border-border hover:border-cyan/30 px-3 py-1.5 rounded-lg transition-all"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
