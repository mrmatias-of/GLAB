'use client'

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Wrench,
  Zap,
} from "lucide-react"
import type { CursoSerializavel } from "@/lib/cursos-data"
import ComboAuthoritySection from "./combo-authority-section"
import ComboPurchaseSteps from "./combo-purchase-steps"
import ComboFaq from "./combo-faq"

type Props = {
  curso: CursoSerializavel
}

const trustItems = [
  { icon: BookOpen, label: "Guias técnicos" },
  { icon: Wrench, label: "Conteúdo prático" },
  { icon: ShieldCheck, label: "Pagamento seguro" },
]

const fallbackAprendizados = [
  "Entender os fundamentos da assistência mobile",
  "Organizar os primeiros procedimentos de bancada",
  "Conhecer etapas essenciais de reparos iniciais",
  "Desenvolver uma base mais clara para praticar",
]

export default function ComboLandingPage({ curso }: Props) {
  const aprendizados =
    curso.aprendizados && curso.aprendizados.length > 0
      ? curso.aprendizados.slice(0, 6)
      : fallbackAprendizados

  const headline = curso.headline || "Comece na assistência mobile com uma base prática"
  const descricao =
    curso.headlineSub ||
    curso.descricaoLonga ||
    curso.descricao ||
    "Conteúdos organizados para quem deseja iniciar nos procedimentos essenciais da assistência mobile."

  return (
    <main className="min-h-screen bg-[#05070c] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute right-0 top-14 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              Combo Iniciante Mobile
            </p>
            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              {descricao}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {trustItems.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-200"
                >
                  <Icon className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href={curso.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-7 py-4 font-bold text-[#05070c] shadow-[0_0_34px_rgba(0,212,200,0.28)] transition hover:brightness-110"
              >
                {curso.cta || "Quero meu Combo"}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <div className="text-sm text-zinc-400">
                <p className="font-semibold text-white">{curso.preco}</p>
                <p>Pagamento seguro • Conteúdo digital</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-br from-cyan-400 to-fuchsia-500 opacity-70 blur-sm" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0e16] p-4">
              {curso.imagem ? (
                <Image
                  src={curso.imagem}
                  alt={curso.titulo}
                  width={700}
                  height={700}
                  className="aspect-square w-full rounded-2xl object-cover"
                  priority
                />
              ) : (
                <div className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 p-8 text-center">
                  <Smartphone className="h-16 w-16 text-cyan-400" aria-hidden="true" />
                  <p className="mt-5 text-xl font-bold">Combo Iniciante Mobile</p>
                  <p className="mt-2 text-sm text-zinc-400">Conteúdo digital para assistência mobile</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="conteudo-combo" className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-400">O que você recebe</p>
            <h2 id="conteudo-combo" className="mt-3 text-3xl font-bold text-white">
              Uma base organizada para começar
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              Estude os principais conceitos e procedimentos apresentados no combo, com uma
              experiência digital objetiva e pensada para a prática.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {aprendizados.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-zinc-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ComboAuthoritySection />
      <ComboPurchaseSteps />

      <section aria-labelledby="oferta-combo" className="bg-[#05070c] pb-16 sm:pb-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-[30px] border border-cyan-400/25 bg-[#0a0e16] p-7 sm:p-10">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.07] to-fuchsia-500/[0.08]" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-400">Comece por aqui</p>
                <h2 id="oferta-combo" className="mt-3 text-3xl font-bold text-white">
                  {curso.titulo}
                </h2>
                <p className="mt-3 max-w-xl text-zinc-300">
                  Conteúdo digital para desenvolver sua base na assistência mobile com
                  procedimentos organizados e linguagem direta.
                </p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-300">
                  <span className="inline-flex items-center gap-2">
                    <Zap className="h-4 w-4 text-cyan-400" /> Acesso digital
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" /> Pagamento seguro
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#05070c]/70 p-6 text-center lg:min-w-[295px]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Investimento</p>
                <p className="mt-2 text-4xl font-black text-white">{curso.preco}</p>
                <Link
                  href={curso.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-4 font-bold text-[#05070c] transition hover:brightness-110"
                >
                  Comprar agora
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <p className="mt-3 text-xs text-zinc-400">Pagamento seguro</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ComboFaq />

      <section className="border-t border-white/10 bg-[#070a10] py-12 text-center">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="text-3xl font-bold text-white">Pronto para começar?</h2>
          <p className="mt-3 text-zinc-400">
            Conheça o Combo Iniciante Mobile e comece a estudar conteúdos práticos de assistência mobile.
          </p>
          <Link
            href={curso.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-8 py-4 font-bold text-[#05070c] transition hover:brightness-110"
          >
            Quero meu Combo
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
