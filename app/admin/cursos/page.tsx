import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Pencil, ExternalLink } from "lucide-react"

export default async function AdminCursosPage() {
  const supabase = await createClient()
  const { data: cursos } = await supabase.from("cursos").select("*").order("ordem")

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground">Guias / Cursos</h1>
          <p className="text-muted-foreground text-sm mt-1">{cursos?.length ?? 0} guia(s) cadastrado(s)</p>
        </div>
        <Link
          href="/admin/cursos/novo"
          className="inline-flex items-center gap-2 bg-cyan text-background font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-cyan/90 shadow-[0_0_20px_rgba(0,212,200,0.25)] transition-all"
        >
          <Plus size={15} />
          Novo Guia
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-4">Guia</th>
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-4">Preço</th>
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-4">Checkout</th>
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-4">Status</th>
              <th className="text-right text-xs font-bold text-muted-foreground uppercase tracking-wider px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cursos?.map((curso) => (
              <tr key={curso.id} className="hover:bg-surface-hover transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${curso.ativo ? "bg-cyan" : "bg-muted-foreground"}`} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{curso.titulo}</p>
                      <p className="text-xs text-muted-foreground">{curso.tag} · /{curso.slug}</p>
                    </div>
                    {curso.destaque && (
                      <span className="text-[10px] font-black bg-cyan/15 text-cyan border border-cyan/20 px-2 py-0.5 rounded-full">
                        DESTAQUE
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-cyan">{curso.preco}</span>
                  {curso.preco_original && (
                    <span className="text-xs text-muted-foreground line-through ml-2">{curso.preco_original}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {curso.cta_href && curso.cta_href !== "#" ? (
                    <a
                      href={curso.cta_href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-green-400 hover:text-green-300 transition-colors"
                    >
                      <ExternalLink size={12} />
                      Configurado
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sem link</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${curso.ativo ? "bg-green-400/10 text-green-400" : "bg-muted text-muted-foreground"}`}>
                    {curso.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/cursos/editar/${curso.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-cyan border border-border hover:border-cyan/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Pencil size={12} />
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
