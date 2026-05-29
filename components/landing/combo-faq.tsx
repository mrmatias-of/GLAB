'use client'

import { ChevronDown } from "lucide-react"

const faqs = [
  {
    pergunta: "Como recebo acesso ao conteúdo após a compra?",
    resposta:
      "Após a confirmação do pagamento, o acesso ao conteúdo digital adquirido é disponibilizado no ambiente de compra.",
  },
  {
    pergunta: "O pagamento é seguro?",
    resposta:
      "Sim. A finalização da compra acontece em ambiente seguro de checkout externo ao site da G•Lab Cursos.",
  },
  {
    pergunta: "Este conteúdo é para iniciantes?",
    resposta:
      "O Combo Iniciante Mobile foi estruturado para quem deseja começar pelos fundamentos e procedimentos essenciais da assistência mobile.",
  },
  {
    pergunta: "Onde acesso um conteúdo que já comprei?",
    resposta:
      'Use o link "Acessar conteúdo" disponível no topo ou no rodapé desta página.',
  },
]

export default function ComboFaq() {
  return (
    <section aria-labelledby="faq-combo" className="bg-[#05070c] py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <p className="text-center text-sm font-bold uppercase tracking-[0.22em] text-cyan-400">
          Dúvidas frequentes
        </p>
        <h2 id="faq-combo" className="mt-3 text-center text-3xl font-bold text-white">
          Antes de começar
        </h2>

        <div className="mt-9 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.pergunta}
              className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 open:border-cyan-400/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white">
                {faq.pergunta}
                <ChevronDown className="h-5 w-5 shrink-0 text-cyan-400 transition group-open:rotate-180" />
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">{faq.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
