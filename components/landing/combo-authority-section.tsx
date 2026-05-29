'use client'

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const badges = [
  { top: "+10 anos", bottom: "de experiência" },
  { top: "+Prática", bottom: "100% na bancada" },
  { top: "Foco", bottom: "Resultados reais" },
  { top: "Método", bottom: "Direto e sem enrolação" },
]

export default function ComboAuthoritySection() {
  return (
    <section aria-labelledby="quem-e-o-gj" className="bg-[#080b12] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-14">

          {/* Foto com glow neon */}
          <div className="relative mx-auto w-64 shrink-0 sm:w-72 lg:mx-0">
            {/* Glow externo */}
            <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-b from-cyan-400 via-fuchsia-500 to-cyan-400 opacity-90" />
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900">
              <Image
                src="/images/gj/guilherme-juliao.jpg"
                alt="Guilherme Julião, criador da G•Lab Cursos"
                width={560}
                height={840}
                className="w-full object-cover object-top grayscale"
                style={{ aspectRatio: "2/2.8" }}
              />
            </div>
          </div>

          {/* Texto */}
          <div className="flex-1">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-400">Quem é o GJ</p>
            <h2 id="quem-e-o-gj" className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Guilherme Julião (GJ)
            </h2>
            <p className="mt-5 text-base leading-relaxed text-zinc-300">
              Há mais de 10 anos na área de manutenção mobile, já vi de tudo na bancada.
              Criei a G•Lab Cursos para compartilhar o que realmente funciona no dia a dia,
              sem enrolação e com total transparência.
            </p>
            <p className="mt-3 text-base leading-relaxed text-zinc-400">
              Meu objetivo é te mostrar o caminho mais direto para construir uma base técnica
              sólida e atuar com mais segurança na assistência mobile.
            </p>

            {/* Badges de credibilidade */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {badges.map((b) => (
                <div
                  key={b.top}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center"
                >
                  <p className="text-sm font-black text-cyan-400">{b.top}</p>
                  <p className="mt-0.5 text-xs leading-tight text-zinc-500">{b.bottom}</p>
                </div>
              ))}
            </div>

            <Link
              href="https://www.instagram.com/_gjuliao/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Vamos começar?
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
