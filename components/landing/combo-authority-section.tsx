'use client'

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Wrench, BookOpen, Target } from "lucide-react"

const badges = [
  { icon: Wrench, title: "+10 anos", text: "de experiência" },
  { icon: BookOpen, title: "Prático", text: "para a bancada" },
  { icon: Target, title: "Direto", text: "ao ponto" },
]

export default function ComboAuthoritySection() {
  return (
    <section aria-labelledby="quem-e-o-gj" className="border-y border-white/10 bg-[#080b12] py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[350px_1fr] lg:items-center">
        <div className="relative mx-auto w-full max-w-[350px]">
          <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 opacity-80 blur-sm" />
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900">
            <Image
              src="/images/gj/guilherme-juliao.jpg"
              alt="Guilherme Julião, criador da G•Lab Cursos"
              width={700}
              height={1040}
              className="aspect-[2/2.65] w-full object-cover object-top grayscale"
            />
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-cyan-400">Quem é o GJ</p>
          <h2 id="quem-e-o-gj" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Guilherme Julião <span className="text-cyan-400">(GJ)</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Guilherme Julião é o criador da G•Lab Cursos. Com 10 anos de experiência,
            desenvolve conteúdos técnicos voltados para quem deseja aprender procedimentos
            práticos e evoluir na rotina de assistência técnica.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
            O foco dos materiais é apresentar conteúdos organizados, objetivos e aplicáveis
            à bancada, ajudando o aluno a construir sua base técnica com clareza.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {badges.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Icon className="mb-3 h-5 w-5 text-cyan-400" aria-hidden="true" />
                <p className="font-bold text-white">{title}</p>
                <p className="text-sm text-zinc-400">{text}</p>
              </div>
            ))}
          </div>

          <Link
            href="https://www.instagram.com/_gjuliao/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            Acompanhar @_gjuliao no Instagram
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
