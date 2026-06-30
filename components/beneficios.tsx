import Link from "next/link"
import { ArrowRight, Clock, Headphones, FileCheck, Quote, Users, Zap } from "lucide-react"

const depoimentos = [
  {
    texto: "Cara, eu trabalhava há 3 anos na assistência e achava que já sabia tudo sobre troca de tela. Depois que fiz o curso, percebi que tava fazendo muita coisa errada. Aprendi a identificar dano por pressão antes de abrir o aparelho, isso sozinho já me poupou muita dor de cabeça com cliente.",
    nome: "Rafael M.",
    cidade: "São Paulo, SP",
    curso: "Troca de Tela",
    accent: "blue",
  },
  {
    texto: "Fiz o de diagnóstico avançado e mudou completamente como eu atendo. Antes eu chutava o problema, hoje eu sigo um raciocínio. Semana passada resolvi um iPhone que dois outros técnicos já tinham devolvido pro cliente sem conserto. O cliente ficou em choque.",
    nome: "Leandro T.",
    cidade: "Curitiba, PR",
    curso: "Diagnóstico Avançado",
    accent: "violet",
  },
  {
    texto: "Eu sou novo na área, comecei do zero mesmo. O que me conquistou foi a linguagem, sem enrolação, sem ficar aprofundando em coisa que não usa no dia a dia. Em dois meses já tô atendendo sozinho na loja do meu irmão. Recomendo pra quem quer entrar na área do jeito certo.",
    nome: "Caio B.",
    cidade: "Goiânia, GO",
    curso: "COMBO INICIANTE",
    accent: "orange",
  },
]

const accentMap: Record<string, { border: string; text: string; bg: string; dot: string }> = {
  cyan:   { border: "border-blue-500/20",   text: "text-blue-400",   bg: "rgba(0,212,200,0.04)",   dot: "#00d4c8" },
  violet: { border: "border-violet-500/20", text: "text-violet-400", bg: "rgba(124,58,237,0.04)",  dot: "#7c3aed" },
  orange: { border: "border-orange-500/20", text: "text-orange-400", bg: "rgba(249,115,22,0.04)",  dot: "#f97316" },
}

export default function Beneficios() {
  return (
    <section className="py-16 px-6" style={{ backgroundColor: '#050510' }} id="resultados">
      <div className="max-w-7xl mx-auto">

        {/* Header da secao */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: '#00d4c8' }}>Opiniões reais</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Quem aplica na bancada <span style={{ background: 'linear-gradient(135deg, #00d4c8 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>recomenda</span>
          </h2>
        </div>

        {/* Cards de depoimentos */}
        <div className="grid md:grid-cols-3 gap-4">
          {depoimentos.map((d) => {
            const a = accentMap[d.accent]
            return (
              <div
                key={d.nome}
                className={`relative rounded-2xl border ${a.border} p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02]`}
                style={{ background: a.bg }}
              >
                {/* Icone de aspas */}
                <Quote size={20} className={a.text} style={{ opacity: 0.5 }} />

                {/* Texto do depoimento */}
                <p className="text-sm text-white/70 leading-relaxed flex-1">
                  &ldquo;{d.texto}&rdquo;
                </p>

                {/* Rodape */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    {/* Avatar inicial */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                      style={{ background: a.dot, opacity: 0.9 }}
                    >
                      {d.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{d.nome}</p>
                      <p className="text-[10px] text-white/30">{d.cidade}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border ${a.border} ${a.text}`}
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    {d.curso}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
          {/* Glow effects de fundo */}
          <div className="absolute -top-20 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
