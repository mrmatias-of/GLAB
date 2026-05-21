const depoimentos = [
  {
    nome: "Carlos S.",
    cidade: "Campinas, SP",
    curso: "Guia Mestre: Troca de Tela",
    texto: "Cara, eu tava quebrando a cabeca toda vez que chegava tela de iPhone aqui. Depois que peguei o guia entendi onde tava errando.",
  },
  {
    nome: "Rafael O.",
    cidade: "Ribeirao Preto, SP",
    curso: "Combo Iniciante Mobile",
    texto: "Comecei na assistencia faz 4 meses. Comprei o combo e foi a melhor coisa que fiz.",
  },
  {
    nome: "Amanda F.",
    cidade: "Sorocaba, SP",
    curso: "Guia Mestre: Troca de Tela",
    texto: "Eu ja fazia troca de tela mas ainda tinha retorno as vezes. Depois que comecei a seguir o protocolo, zerou.",
  },
  {
    nome: "Lucas M.",
    cidade: "Piracicaba, SP",
    curso: "Guia Mestre: Conectores",
    texto: "O guia de conector me surpreendeu. Achei que ja sabia tudo mas tinha coisa que eu fazia errado faz anos.",
  },
  {
    nome: "Fernanda C.",
    cidade: "Jundiai, SP",
    curso: "Guia Mestre: Conectores",
    texto: "Antes eu evitava servico de conector, ficava insegura. Hoje e um dos que mais faco.",
  },
  {
    nome: "Thiago P.",
    cidade: "Paulinia, SP",
    curso: "Guia Mestre: Bateria",
    texto: "Por 9 conto aprendi coisa que nao achei em video nenhum. Serio. Ja indiquei pra dois colegas.",
  },
]

export default function Depoimentos() {
  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="text-violet-400 text-xs uppercase tracking-widest mb-3">Depoimentos</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            O que estao dizendo
          </h2>
        </div>

        {/* Grid de depoimentos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {depoimentos.map((dep, index) => (
            <div
              key={index}
              className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 hover:border-violet-500/20 transition-all"
            >
              {/* Avatar e nome */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {dep.nome.split(" ")[0][0]}{dep.nome.split(" ")[1]?.[0] ?? ""}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">{dep.nome}</p>
                  <p className="text-white/40 text-sm">{dep.cidade}</p>
                </div>
              </div>

              {/* Texto */}
              <p className="text-white/60 leading-relaxed mb-4">
                {dep.texto}
              </p>

              {/* Curso */}
              <p className="text-violet-400/60 text-sm">
                {dep.curso}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
