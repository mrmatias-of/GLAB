import { Quote } from "lucide-react"

const depoimentos = [
  {
    nome: "Carlos Eduardo Silva",
    cidade: "Campinas, SP",
    texto: "Os guias mudaram completamente minha forma de trabalhar. Antes eu perdia horas em reparos que agora faço em minutos. O conteudo e direto ao ponto.",
  },
  {
    nome: "Rafael Oliveira Santos",
    cidade: "Ribeirao Preto, SP",
    texto: "Comecei do zero na assistencia tecnica. Com os guias do G-Lab, em 3 meses ja estava atendendo clientes com confianca. Vale cada centavo.",
  },
  {
    nome: "Amanda Cristina Ferreira",
    cidade: "Sorocaba, SP",
    texto: "O guia de troca de tela me ajudou a evitar erros que eu nem sabia que estava cometendo. Meu indice de retorno caiu muito depois que apliquei as tecnicas.",
  },
  {
    nome: "Lucas Henrique Martins",
    cidade: "Piracicaba, SP",
    texto: "Profissionalismo puro. Os checklists e metodologias dos guias elevaram o nivel do meu trabalho. Meus clientes percebem a diferenca.",
  },
  {
    nome: "Fernanda Costa Lima",
    cidade: "Jundiai, SP",
    texto: "Tinha medo de mexer com conector de carga. Depois do guia, virou um dos servicos que mais executo. Explicacao clara e sem enrolacao.",
  },
  {
    nome: "Thiago Augusto Pereira",
    cidade: "Paulinia, SP",
    texto: "O combo iniciante foi o melhor investimento que fiz. Aprendi troca de tela, bateria e conector de uma vez. Recomendo para quem esta comecando.",
  },
]

export default function Depoimentos() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-cyan/[0.02] to-background" />
      
      <div className="relative max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-cyan/10 text-cyan border border-cyan/20 mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            O que dizem nossos alunos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tecnicos de todo o Brasil aplicando os metodos dos Guias Mestre no dia a dia da bancada.
          </p>
        </div>

        {/* Grid de depoimentos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {depoimentos.map((dep, index) => (
            <div
              key={index}
              className="relative group bg-[#0a1018] border border-border hover:border-cyan/20 rounded-2xl p-6 transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="absolute -top-3 -left-2 w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                <Quote size={14} className="text-cyan" />
              </div>

              {/* Texto */}
              <p className="text-sm text-foreground/80 leading-relaxed mb-6 mt-2">
                &quot;{dep.texto}&quot;
              </p>

              {/* Autor */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan/20 to-cyan/5 border border-cyan/20 flex items-center justify-center">
                  <span className="text-cyan font-bold text-sm">
                    {dep.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{dep.nome}</p>
                  <p className="text-xs text-muted-foreground">{dep.cidade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
