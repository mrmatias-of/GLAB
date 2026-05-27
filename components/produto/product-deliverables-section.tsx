import { Gift, BookOpen, Award, Clock, Zap, Headphones } from "lucide-react"
import type { CursoSerializavel } from "@/lib/cursos-data"

export default function ProductDeliverablesSection({ curso }: { curso: CursoSerializavel }) {
  const totalTopicos = curso.modulos.reduce((acc, m) => acc + m.topicos.length, 0)

  const items = [
    {
      icon: BookOpen,
      titulo: "Guia completo na plataforma",
      descricao: `Acesso a todos os ${curso.modulos.length} módulos e ${totalTopicos} tópicos do conteúdo.`,
    },
    {
      icon: Award,
      titulo: "Certificado digital",
      descricao: "Certificado de conclusão ao finalizar o conteúdo.",
    },
    {
      icon: Clock,
      titulo: "Acesso vitalício",
      descricao: "Estude no seu ritmo, sem prazo de expiração.",
    },
    {
      icon: Zap,
      titulo: "Pagamento único",
      descricao: "Sem mensalidade. Pague uma vez e acesse para sempre.",
    },
  ]

  return (
    <section className="py-16 relative" style={{ backgroundColor: "#050510" }}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)" }}
      />

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center">
            <Gift size={18} className="text-violet-400" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">O que você recebe ao comprar</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-white/8 px-5 py-5 transition-all duration-200 hover:border-violet-500/20"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.04) 0%, transparent 100%)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <item.icon size={18} className="text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-0.5">{item.titulo}</p>
                <p className="text-xs text-white/45 leading-relaxed">{item.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)" }}
      />
    </section>
  )
}
