"use client"

import { useState } from "react"
import { HelpCircle, ChevronDown } from "lucide-react"
import type { CursoSerializavel } from "@/lib/cursos-data"

type FaqItem = { pergunta: string; resposta: string }

function getFaqItems(curso: CursoSerializavel): FaqItem[] {
  const isComboIniciante = curso.slug === "combo-iniciante-mobile"
  const isAvancado =
    curso.nivel === "avançado" || curso.nivel === "intermediário"

  // FAQs específicas para Combo Iniciante
  if (isComboIniciante) {
    return [
      {
        pergunta: "Para quem o Combo Iniciante é indicado?",
        resposta:
          "Ele foi desenvolvido para quem deseja iniciar seus estudos em assistência técnica mobile pelos reparos essenciais da bancada.",
      },
      {
        pergunta: "Quais temas estão incluídos no Combo?",
        resposta:
          "O Combo Iniciante cobre Ferramentas & Segurança, Troca de Tela (iPhone e Android), Bateria & Conector com 4 módulos organizados.",
      },
      {
        pergunta: "Como recebo acesso após a compra?",
        resposta:
          "O acesso é liberado imediatamente após a confirmação do pagamento. Você receberá um e-mail com as instruções para acessar a plataforma.",
      },
      {
        pergunta: "O acesso é vitalício?",
        resposta:
          "As condições de acesso são definidas pela Kirvano, onde o conteúdo é disponibilizado após a confirmação do pagamento.",
      },
      {
        pergunta: "Preciso ter experiência anterior?",
        resposta:
          "Não é necessário ter experiência avançada para começar. O conteúdo é organizado para quem deseja construir uma base sólida na assistência mobile.",
      },
    ]
  }

  const base: FaqItem[] = [
    {
      pergunta: "Como recebo acesso após a compra?",
      resposta:
        "O acesso é liberado imediatamente após a confirmação do pagamento. Você receberá um e-mail com as instruções para acessar a plataforma.",
    },
    {
      pergunta: "O acesso é vitalício?",
      resposta:
        "As condições de acesso são definidas pela Kirvano, onde o conteúdo é disponibilizado após a confirmação do pagamento.",
    },
    {
      pergunta: "Preciso ter ferramentas para acompanhar?",
      resposta:
        "O conteúdo pode ser acompanhado em estudo teórico, mas para aplicar na prática você precisará de ferramentas básicas de bancada, conforme o tipo de reparo abordado.",
    },
  ]

  if (!isAvancado) {
    base.push({
      pergunta: "Este guia é indicado para iniciantes?",
      resposta:
        "Sim. O conteúdo foi desenvolvido levando em conta diferentes níveis de experiência. Iniciantes conseguem acompanhar a sequência do guia.",
    })
  }

  // Inclui pergunta sobre iPhone/Android apenas se for conteúdo mobile
  // (exclui explicitamente PC/Windows para evitar pergunta irrelevante)
  const isPC =
    curso.slug === "guia-otimizacao-pc-gamer" ||
    curso.tag?.toLowerCase().includes("pc") ||
    curso.tag?.toLowerCase().includes("windows") ||
    curso.categoria?.toLowerCase().includes("pc")

  if (!isPC) {
    base.push({
      pergunta: "O conteúdo serve para iPhone e Android?",
      resposta:
        "O conteúdo aborda conceitos e procedimentos que se aplicam a smartphones em geral. Situações específicas de plataforma são indicadas quando relevantes.",
    })
  }

  if (isAvancado) {
    base.push(
      {
        pergunta: "Este guia é indicado para quem já realiza reparos?",
        resposta:
          "Sim. O conteúdo pressupõe familiaridade com procedimentos básicos de bancada. Recomendado para técnicos que já atuam e desejam evoluir.",
      },
      {
        pergunta: "Quais conhecimentos prévios são recomendados?",
        resposta:
          "Recomenda-se experiência com reparos básicos em smartphones antes de iniciar conteúdos avançados de diagnóstico ou análise de placa.",
      }
    )
  }

  return base
}

export default function ProductFaqSection({ curso }: { curso: CursoSerializavel }) {
  const faqItems = getFaqItems(curso)
  const [aberto, setAberto] = useState<number | null>(null)

  return (
    <section className="py-16 relative" style={{ backgroundColor: "#050510" }}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,200,0.2), transparent)" }}
      />

      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
            <HelpCircle size={18} className="text-cyan-400" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Perguntas frequentes</h2>
        </div>

        <div className="flex flex-col gap-2">
          {faqItems.map((item, i) => {
            const isOpen = aberto === i
            return (
              <div
                key={i}
                className="rounded-xl border overflow-hidden transition-all duration-200"
                style={{
                  borderColor: isOpen ? "rgba(0,212,200,0.25)" : "rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <button
                  onClick={() => setAberto(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-semibold text-white/85">{item.pergunta}</span>
                  <ChevronDown
                    size={16}
                    className="text-cyan-400/60 shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 border-t border-white/5">
                    <p className="text-sm text-white/55 leading-relaxed pt-3">{item.resposta}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
