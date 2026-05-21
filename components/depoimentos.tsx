const depoimentos = [
  {
    nome: "Carlos S.",
    cidade: "Campinas, SP",
    curso: "Guia Mestre: Troca de Tela",
    texto: "Cara, eu tava quebrando a cabeça toda vez que chegava tela de iPhone aqui. Depois que peguei o guia entendi onde tava errando. Agora vai de primeira, sem drama.",
  },
  {
    nome: "Rafael O.",
    cidade: "Ribeirao Preto, SP",
    curso: "Combo Iniciante Mobile",
    texto: "Comecei na assistencia faz 4 meses. Comprei o combo e foi a melhor coisa que fiz. Nao tinha ninguem pra me ensinar aqui perto, o guia supriu isso.",
  },
  {
    nome: "Amanda F.",
    cidade: "Sorocaba, SP",
    curso: "Guia Mestre: Troca de Tela",
    texto: "Eu ja fazia troca de tela mas ainda tinha retorno as vezes. Ai vi que tava pulando o checklist. Simples assim. Depois que comecei a seguir o protocolo, zerou.",
  },
  {
    nome: "Lucas M.",
    cidade: "Piracicaba, SP",
    curso: "Guia Mestre: Conectores & Carga",
    texto: "O guia de conector me surpreendeu. Achei que ja sabia tudo sobre isso mas tinha coisa que eu fazia errado faz anos. Valeu demais.",
  },
  {
    nome: "Fernanda C.",
    cidade: "Jundiai, SP",
    curso: "Guia Mestre: Conectores & Carga",
    texto: "Antes eu evitava servico de conector, ficava insegura. Hoje e um dos que mais faço. O passo a passo e bem claro, nao tem como errar seguindo direito.",
  },
  {
    nome: "Thiago P.",
    cidade: "Paulinia, SP",
    curso: "Guia Mestre: Troca de Bateria",
    texto: "Por 9 conto aprendi coisa que nao achei em video nenhum. Serio. O negocio e bem tecnico mesmo, nao e enrolacao. Ja indiquei pra dois colegas meus.",
  },
]

export default function Depoimentos() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-cyan/10 text-cyan border border-cyan/20 mb-4">
            Quem ja usou
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 text-balance">
            O que estao falando
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            Tecnicos de todo o Brasil usando os Guias Mestre no dia a dia.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {depoimentos.map((dep, index) => (
            <div
              key={index}
              className="flex flex-col bg-[#0a1018] border border-border hover:border-white/10 rounded-2xl p-6 transition-all duration-300"
            >
              {/* Autor no topo */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-border flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-muted-foreground">
                    {dep.nome.split(" ")[0][0]}{dep.nome.split(" ")[1]?.[0] ?? ""}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{dep.nome}</p>
                  <p className="text-xs text-muted-foreground">{dep.cidade}</p>
                </div>
              </div>

              {/* Texto corrido, sem aspas gigantes */}
              <p className="text-sm text-foreground/75 leading-relaxed flex-1">
                {dep.texto}
              </p>

              {/* Curso referenciado */}
              <p className="text-[11px] text-cyan/60 mt-5 pt-4 border-t border-border/60">
                {dep.curso}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
