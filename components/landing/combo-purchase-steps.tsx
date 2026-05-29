'use client'

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    num: "01",
    title: "Escolha o combo",
    text: "Veja os conteúdos incluídos e clique no botão de compra.",
  },
  {
    num: "02",
    title: "Finalize com segurança",
    text: "Conclua o pagamento em ambiente seguro de checkout.",
  },
  {
    num: "03",
    title: "Acesse seu conteúdo",
    text: "Após a confirmação da compra, consulte seu material digital.",
  },
]

export default function ComboPurchaseSteps() {
  return (
    <section aria-labelledby="como-funciona" className="bg-[#0a0e18] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-center text-sm font-bold uppercase tracking-[0.22em] text-cyan-400">
          Simples assim
        </p>
        <h2 id="como-funciona" className="mt-2 text-center text-3xl font-black text-white">
          Como funciona
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map(({ num, title, text }) => (
            <div
              key={num}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#080b12] p-6"
            >
              <span className="absolute right-4 top-3 text-6xl font-black leading-none text-white/[0.04]">
                {num}
              </span>
              <p className="text-3xl font-black text-cyan-400">{num}</p>
              <h3 className="mt-3 text-base font-bold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="https://app.kirvano.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-cyan-400"
          >
            Já comprou? Acessar meu conteúdo
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
