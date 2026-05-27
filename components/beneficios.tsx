import Link from "next/link"
import { ArrowRight, Clock, Headphones, FileCheck, Shield, Quote, Users, Zap, Target, Play } from "lucide-react"

const depoimentos = [
  {
    texto: "Cara, eu trabalhava há 3 anos na assistência e achava que já sabia tudo sobre troca de tela. Depois que fiz o curso, percebi que tava fazendo muita coisa errada. Aprendi a identificar dano por pressão antes de abrir o aparelho, isso sozinho já me poupou muita dor de cabeça com cliente.",
    nome: "Rafael M.",
    cidade: "São Paulo, SP",
    curso: "Troca de Tela",
    accent: "cyan",
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
  cyan:   { border: "border-cyan-500/20",   text: "text-cyan-400",   bg: "rgba(0,212,200,0.04)",   dot: "#00d4c8" },
  violet: { border: "border-violet-500/20", text: "text-violet-400", bg: "rgba(124,58,237,0.04)",  dot: "#7c3aed" },
  orange: { border: "border-orange-500/20", text: "text-orange-400", bg: "rgba(249,115,22,0.04)",  dot: "#f97316" },
}

export default function Beneficios() {
  return (
    <section className="py-16 px-6" style={{ backgroundColor: '#050510' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header da secao */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: '#00d4c8' }}>Quem ja passou por aqui</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Depoimento dos <span style={{ background: 'linear-gradient(135deg, #00d4c8 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>alunos</span>
          </h2>
        </div>

        {/* Cards de depoimentos */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
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

        {/* CTA Premium - Nivel Profissional */}
        <div className="relative">
          {/* Glow effects de fundo */}
          <div className="absolute -top-20 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div 
            className="relative rounded-3xl overflow-hidden border border-cyan-500/30 p-1"
            style={{ 
              background: 'linear-gradient(135deg, rgba(0,212,200,0.1) 0%, rgba(124,58,237,0.1) 100%)',
              boxShadow: '0 0 60px rgba(0,212,200,0.15), 0 0 100px rgba(124,58,237,0.1)'
            }}
          >
            {/* Grid overlay */}
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,212,200,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,212,200,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px'
              }}
            />

            <div 
              className="relative rounded-2xl p-8 md:p-12 lg:p-16"
              style={{ background: 'rgba(5,5,16,0.95)' }}
            >
              <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                
                {/* Coluna Esquerda - Conteudo Principal */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 mb-6" style={{ background: 'rgba(0,212,200,0.05)' }}>
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">Plataforma Aberta</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                    Transforme Sua
                    <br />
                    <span style={{ background: 'linear-gradient(135deg, #00d4c8 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Carreira Tecnica
                    </span>
                    <br />
                    Agora.
                  </h2>
                  
                  <p className="text-base md:text-lg text-white/50 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    Domine as tecnicas que separam tecnicos comuns de 
                    <span className="text-white font-medium"> profissionais requisitados</span>. 
                    Metodo validado por mais de 2.000 alunos.
                  </p>
                  
                  {/* Botao CTA Premium */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <Link 
                      href="/cursos"
                      className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-base text-black transition-all duration-300 hover:scale-105"
                      style={{ 
                        background: 'linear-gradient(135deg, #00d4c8 0%, #00b8ad 50%, #7c3aed 100%)',
                        boxShadow: '0 0 30px rgba(0,212,200,0.4), 0 10px 40px rgba(0,0,0,0.3)'
                      }}
                    >
                      <Play size={18} fill="black" />
                      Acessar Plataforma
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)', transform: 'skewX(-20deg) translateX(-100%)', animation: 'shine 1.5s ease-in-out infinite' }}
                        />
                      </div>
                    </Link>
                    
                    <a 
                      href="https://chat.whatsapp.com/KiK2TDOf1HzGlkgH8IEL4B"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-cyan-400 transition-colors"
                    >
                      <Users size={16} />
                      Entrar na Comunidade
                    </a>
                  </div>
                </div>

                {/* Coluna Direita - Cards de Valor */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                  {[
                    { icon: Users, value: "2.000+", label: "Tecnicos Formados", color: "#00d4c8" },
                    { icon: Target, value: "100%", label: "Metodo Pratico", color: "#7c3aed" },
                    { icon: Zap, value: "7 dias", label: "Resultado Rapido", color: "#f97316" },
                    { icon: Play, value: "Agora", label: "Acesso Imediato", color: "#10b981" },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div 
                        key={item.label}
                        className="relative p-4 rounded-2xl border border-white/10 transition-all duration-300 hover:border-white/20 hover:scale-105"
                        style={{ background: 'rgba(255,255,255,0.02)' }}
                      >
                        <Icon size={20} style={{ color: item.color }} className="mb-2" />
                        <p className="text-xl font-black text-white">{item.value}</p>
                        <p className="text-[10px] text-white/40 font-medium uppercase tracking-wide">{item.label}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Trust badges - Redesenhados */}
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-12 pt-8 border-t border-white/5">
                {[
                  { icon: Clock, text: "Acesso Vitalicio" },
                  { icon: Headphones, text: "Suporte Direto" },
                  { icon: FileCheck, text: "Certificado Digital" },
                  { icon: Shield, text: "Garantia 7 Dias" },
                ].map((badge) => {
                  const Icon = badge.icon
                  return (
                    <div key={badge.text} className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center border border-cyan-500/20"
                        style={{ background: 'rgba(0,212,200,0.05)' }}
                      >
                        <Icon size={14} style={{ color: '#00d4c8' }} />
                      </div>
                      <span className="text-xs font-medium text-white/60">{badge.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
