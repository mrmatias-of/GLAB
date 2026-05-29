'use client'

export default function ComboPurchaseSteps() {
  const passos = [
    {
      numero: "01",
      titulo: "Escolha o combo",
      texto: "Veja os conteúdos incluídos e clique no botão de compra.",
    },
    {
      numero: "02",
      titulo: "Finalize com segurança",
      texto: "Conclua o pagamento em ambiente seguro de checkout.",
    },
    {
      numero: "03",
      titulo: "Acesse seu conteúdo",
      texto: "Após a confirmação da compra, consulte seu material digital.",
    },
  ]

  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: "#05070c" }}
      aria-labelledby="steps-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#00d4c8" }}
          >
            Simples assim
          </p>
          <h2
            id="steps-heading"
            className="text-2xl md:text-3xl font-black tracking-tight text-white"
          >
            Como funciona
          </h2>
        </div>

        {/* Cards de passos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {passos.map((passo) => (
            <div
              key={passo.numero}
              className="relative rounded-2xl p-6"
              style={{
                backgroundColor: "#080b12",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Número decorativo */}
              <span
                className="block text-5xl font-black leading-none mb-4"
                style={{ color: "rgba(0,212,200,0.15)" }}
                aria-hidden="true"
              >
                {passo.numero}
              </span>
              <h3 className="text-base font-bold text-white mb-2">
                {passo.titulo}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#71717a" }}
              >
                {passo.texto}
              </p>
            </div>
          ))}
        </div>

        {/* Link discreto para alunos */}
        <div className="text-center">
          <a
            href="https://app.kirvano.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-colors"
            style={{ color: "#52525b" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4c8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#52525b")}
          >
            Já comprou? Acessar meu conteúdo →
          </a>
        </div>
      </div>
    </section>
  )
}
