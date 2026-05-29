"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqItems = [
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
  const [aberto, setAberto] = useState<number | null>(null)

  const toggle = (i: number) => setAberto(aberto === i ? null : i)

  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: "#080b12" }}
      aria-labelledby="faq-heading"
    >
      <div className="max-w-2xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "#00d4c8" }}
          >
            Dúvidas frequentes
          </p>
          <h2
            id="faq-heading"
            className="text-2xl md:text-3xl font-black tracking-tight text-white"
          >
            Perguntas frequentes
          </h2>
        </div>

        {/* Itens */}
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: "#0a0e16",
                border: `1px solid ${
                  aberto === i
                    ? "rgba(0,212,200,0.25)"
                    : "rgba(255,255,255,0.07)"
                }`,
                transition: "border-color 0.2s",
              }}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                aria-expanded={aberto === i}
              >
                <span className="text-sm font-semibold text-white pr-4">
                  {item.pergunta}
                </span>
                <ChevronDown
                  size={16}
                  className="flex-shrink-0 transition-transform duration-200"
                  style={{
                    color: "#00d4c8",
                    transform:
                      aberto === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {aberto === i && (
                <div className="px-5 pb-4">
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#a1a1aa" }}
                  >
                    {item.resposta}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
