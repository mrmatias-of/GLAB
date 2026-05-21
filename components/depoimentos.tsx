const depoimentos = [
  {
    nome: "Carlos S.",
    cidade: "Campinas, SP",
    texto: "Excelente conteúdo, muito útil para meu dia a dia",
  },
  {
    nome: "Rafael O.",
    cidade: "Ribeirao Preto, SP",
    texto: "Os guias são muito práticos e fáceis de entender",
  },
  {
    nome: "Amanda F.",
    cidade: "Sorocaba, SP",
    texto: "Recomendo muito, mudou minha forma de trabalhar",
  },
]

export default function Depoimentos() {
  return (
    <section className="py-16 px-5">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12">Depoimentos</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {depoimentos.map((dep, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-6">
              <div className="flex gap-1 mb-4">
                {Array(5).fill(0).map((_, j) => (
                  <span key={j} className="text-purple-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4">&quot;{dep.texto}&quot;</p>
              <p className="font-semibold text-white">{dep.nome}</p>
              <p className="text-sm text-gray-400">{dep.cidade}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
