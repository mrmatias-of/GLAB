const depoimentos = [
  {
    nome: "Carlos S.",
    cargo: "Técnico autônomo — Campinas, SP",
    curso: "Guia Mestre: Troca de Tela",
    texto: "Cara, eu tava quebrando a cabeça toda vez que chegava tela de iPhone aqui. Depois que peguei o guia entendi onde tava errando.",
    avatar: "CS",
  },
  {
    nome: "Rafael O.",
    cargo: "Assistência técnica — Ribeirão Preto, SP",
    curso: "Combo Iniciante Mobile",
    texto: "Comecei na assistência faz 4 meses. Comprei o combo e foi a melhor coisa que fiz. Já paguei o investimento em menos de uma semana.",
    avatar: "RO",
  },
  {
    nome: "Amanda F.",
    cargo: "Técnica — Sorocaba, SP",
    curso: "Guia Mestre: Troca de Tela",
    texto: "Eu já fazia troca de tela mas ainda tinha retorno às vezes. Depois que comecei a seguir o protocolo, zerou.",
    avatar: "AF",
  },
]

export default function Depoimentos() {
  return (
    <section className="px-6 py-16" style={{ backgroundColor: '#0B0B0C' }}>
      <div className="max-w-7xl mx-auto">

        <p className="eyebrow mb-3">Depoimentos</p>
        <h2 className="section-title mb-12">O que dizem</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {depoimentos.map((dep, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ backgroundColor: '#111113', border: '1px solid #27272a' }}
            >
              {/* Estrelas */}
              <div className="flex gap-0.5">
                {Array(5).fill(0).map((_, j) => (
                  <span key={j} style={{ color: '#818cf8', fontSize: 14 }}>★</span>
                ))}
              </div>

              {/* Texto */}
              <p className="text-sm leading-relaxed flex-1" style={{ color: '#a1a1aa' }}>
                &ldquo;{dep.texto}&rdquo;
              </p>

              {/* Rodapé do card */}
              <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid #27272a' }}>
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
                >
                  {dep.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{dep.nome}</p>
                  <p className="text-xs" style={{ color: '#52525b' }}>{dep.cargo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
