import { createClient } from "@/lib/supabase/server"
import { Award, Download, Share2, CheckCircle } from "lucide-react"

export default async function CertificadosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: certificates } = await supabase
    .from("certificates")
    .select(`
      id,
      certificate_code,
      issued_at,
      cursos:curso_id (titulo, slug)
    `)
    .eq("user_id", user?.id)
    .order("issued_at", { ascending: false })

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-black text-foreground mb-8 flex items-center gap-3">
          <Award size={28} className="text-cyan" />
          Certificados
        </h1>

        {certificates && certificates.length > 0 ? (
          <div className="grid gap-4">
            {certificates.map((cert: any) => (
              <div key={cert.id} className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between hover:border-cyan/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center">
                    <CheckCircle size={24} className="text-cyan" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{cert.cursos?.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      Concluído em {new Date(cert.issued_at).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Código: {cert.certificate_code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg border border-border hover:border-cyan/30 hover:text-cyan transition-all">
                    <Download size={18} />
                  </button>
                  <button className="p-2 rounded-lg border border-border hover:border-cyan/30 hover:text-cyan transition-all">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Award size={48} className="text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Nenhum certificado ainda</p>
            <p className="text-sm text-muted-foreground mt-2">Conclua cursos para receber certificados</p>
          </div>
        )}
      </div>
    </div>
  )
}
