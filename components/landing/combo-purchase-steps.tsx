'use client'

import Link from "next/link"
import { ArrowRight, CreditCard, BookOpenCheck, MousePointerClick } from "lucide-react"

const steps = [
  {
    icon: MousePointerClick,
    title: "Escolha o combo",
    text: "Veja os conteúdos incluídos e clique no botão de compra.",
  },
  {
    icon: CreditCard,
    title: "Finalize com segurança",
    text: "Conclua o pagamento em ambiente seguro de checkout.",
  },
  {
    icon: BookOpenCheck,
    title: "Acesse seu conteúdo",
    text: "Após a confirmação da compra, consulte seu material digital.",
  },
]

export default function ComboPurchaseSteps() {
  return (
    <section aria-labelledby="como-funciona" className="bg-[#05070c] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-400">Compra simples</p>
          <h2 id="como-funciona" className="mt-3 text-3xl font-bold text-white">
            Como funciona
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="relative rounded-3xl border border-white/10 bg-white/[0.025] p-6">
              <span className="absolute right-5 top-5 text-4xl font-black text-white/[0.05]">
                0{index + 1}
              </span>
              <Icon className="h-7 w-7 text-cyan-400" aria-hidden="true" />
              <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="https://app.kirvano.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition hover:text-cyan-300"
          >
            Já comprou? Acessar meu conteúdo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
