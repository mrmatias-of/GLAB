'use client'

import { ChevronDown } from "lucide-react"

const faqs = [
  {
    pergunta: "Como recebo acesso aos cursos?",
    resposta:
      "Após a confirmação do pagamento, o acesso ao conteúdo digital é disponibilizado no ambiente de compra, via Kirvano.",
  },
  {
    pergunta: "Por quanto tempo terei acesso?",
    resposta:
      "O prazo de acesso ao conteúdo é definido pela plataforma de checkout. Consulte as condições no momento da compra.",
  },
  {
    pergunta: "Tem certificado de conclusão?",
    resposta:
      "Este produto é um combo de conteúdo digital prático. Informações sobre certificação estão disponíveis na plataforma de acesso.",
  },
  {
    pergunta: "Quais formas de pagamento aceitam?",
    resposta:
      "As formas de pagamento disponíveis são as aceitas pela plataforma de checkout no momento da compra.",
  },
  {
    pergunta: "Posso assistir pelo celular?",
    resposta:
      "Sim, o conteúdo é acessível em dispositivos móveis através da plataforma de acesso.",
  },
  {
    pergunta: "Como funciona o suporte?",
    resposta:
      "O suporte ao conteúdo é feito pela equipe da G•Lab Cursos. Você pode entrar em contato pelo e-mail contato@glabcursos.com.br.",
  },
]

export default function ComboFaq() {
  return (
    <section aria-labelledby="faq-combo" className="bg-[#080b12] py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="text-center text-sm font-bold uppercase tracking-[0.22em] text-cyan-400">
          Dúvidas frequentes
        </p>
        <h2 id="faq-combo" className="mt-2 text-center text-3xl font-black text-white">
          Antes de começar
        </h2>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {faqs.map((faq) => (
            <details
              key={faq.pergunta}
              className="group rounded-xl border border-white/10 bg-[#05070c] p-5 open:border-cyan-400/30"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-white">
                <span>{faq.pergunta}</span>
                <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{faq.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
