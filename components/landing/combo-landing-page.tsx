'use client'

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  Headphones,
  Infinity,
  Play,
  ShieldCheck,
  Smartphone,
  Wrench,
} from "lucide-react"
import type { CursoSerializavel } from "@/lib/cursos-data"
import ComboAuthoritySection from "./combo-authority-section"
import ComboPurchaseSteps from "./combo-purchase-steps"
import ComboFaq from "./combo-faq"

type Props = { curso: CursoSerializavel }

const benefitsStrip = [
  { icon: Play, label: "Aulas práticas passo a passo" },
  { icon: BookOpen, label: "Materiais de apoio exclusivos" },
  { icon: Download, label: "Arquivos para download" },
  { icon: Headphones, label: "Suporte nos conteúdos" },
  { icon: Infinity, label: "Acesso digital imediato" },
]

const ofertaChecklist = [
  "Do básico ao avançado",
  "Aulas práticas e diretas",
  "Materiais de apoio exclusivos",
  "Acesso digital imediato após a confirmação",
  "Suporte nos conteúdos",
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
    "O combo completo para você dominar os procedimentos essenciais e atuar com segurança na assistência mobile."

  return (
    <main className="min-h-screen bg-[#05070c] text-white">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-14 pt-10 sm:pb-20 sm:pt-14">
        {/* ambient glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute -right-32 top-10 h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">

          {/* coluna de texto */}
          <div>
            <span className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
              Combo Iniciante Mobile
            </span>

            <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              <span className="text-white">{headline.split(" ").slice(0, Math.ceil(headline.split(" ").length / 2)).join(" ")}{" "}</span>
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                {headline.split(" ").slice(Math.ceil(headline.split(" ").length / 2)).join(" ")}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              {descricao}
            </p>

            {/* trust badges */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: BookOpen, label: "Guias técnicos" },
                { icon: Wrench, label: "Conteúdo prático" },
                { icon: Infinity, label: "Acesso digital" },
                { icon: ShieldCheck, label: "Pagamento seguro" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300"
                >
                  <Icon className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href={curso.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-7 py-3.5 text-sm font-black uppercase tracking-wide text-[#05070c] shadow-[0_0_32px_rgba(0,212,200,0.3)] transition hover:brightness-110"
              >
                {curso.cta || "Quero garantir meu combo agora"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
              Pagamento seguro • Acesso digital imediato
            </p>
          </div>

          {/* coluna visual */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* glow frame */}
            <div className="absolute -inset-[2px] rounded-[22px] bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-cyan-400 opacity-75 blur-[3px]" />
            <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0b0e16] p-3">
              {curso.imagem ? (
                <Image
                  src={curso.imagem}
                  alt={`Capa do produto ${curso.titulo}`}
                  width={700}
                  height={700}
                  className="w-full rounded-2xl object-cover"
                  style={{ aspectRatio: "1/1" }}
                  priority
                />
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 p-10 text-center" style={{ aspectRatio: "1/1" }}>
                  <Smartphone className="h-14 w-14 text-cyan-400" aria-hidden="true" />
                  <p className="mt-4 text-lg font-black">Combo Iniciante Mobile</p>
                  <p className="mt-1 text-sm text-zinc-400">Conteúdo digital para assistência mobile</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS STRIP ───────────────────────────────────────────── */}
      <div className="border-y border-white/10 bg-[#080b12]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-6">
            {benefitsStrip.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-sm text-zinc-300">
                <Icon className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── O QUE VOCÊ VAI RECEBER ───────────────────────────────────── */}
      <section aria-labelledby="o-que-voce-recebe" className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-center text-sm font-bold uppercase tracking-[0.22em] text-cyan-400">
            O que você vai receber
          </p>
          <h2 id="o-que-voce-recebe" className="mt-2 text-center text-3xl font-black text-white">
            Uma base organizada para começar
          </h2>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {aprendizados.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-xl border border-white/10 bg-[#080b12] p-4"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-zinc-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTHORITY (GJ) ───────────────────────────────────────────── */}
      <ComboAuthoritySection />

      {/* ── COMO FUNCIONA ────────────────────────────────────────────── */}
      <ComboPurchaseSteps />

      {/* ── OFERTA PRINCIPAL ─────────────────────────────────────────── */}
      <section aria-labelledby="oferta-principal" className="bg-[#05070c] py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#080b12]">
            {/* subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5" />

            <div className="relative flex flex-col gap-0 lg:flex-row">

              {/* left: product info */}
              <div className="flex flex-1 flex-col justify-center gap-5 p-8 lg:p-10">
                <span className="w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
                  Oferta especial
                </span>
                <div>
                  <h2 id="oferta-principal" className="text-2xl font-black text-white sm:text-3xl">
                    {curso.titulo}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Acesso a todo o conteúdo do combo na plataforma digital.
                  </p>
                </div>
                <ul className="space-y-2">
                  {ofertaChecklist.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-200">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-5 pt-1 text-sm text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" /> Pagamento 100% seguro
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Infinity className="h-4 w-4 text-cyan-400" /> Acesso digital imediato
                  </span>
                </div>
              </div>

              {/* divider */}
              <div className="hidden w-px self-stretch bg-white/10 lg:block" />

              {/* right: price + CTA */}
              <div className="flex flex-col items-center justify-center gap-5 border-t border-white/10 p-8 text-center lg:w-72 lg:border-l-0 lg:border-t-0 lg:p-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Investimento</p>
                  <p className="mt-1.5 text-5xl font-black text-white">{curso.preco}</p>
                </div>
                <Link
                  href={curso.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-4 text-sm font-black uppercase tracking-wide text-[#05070c] shadow-[0_0_28px_rgba(0,212,200,0.25)] transition hover:brightness-110"
                >
                  Quero garantir meu acesso
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Visa", "Mastercard", "Pix", "Boleto Bancário"].map((m) => (
                    <span key={m} className="rounded border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-500">
                      {m}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-zinc-600">Pagamento seguro</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <ComboFaq />

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="bg-[#05070c] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Pronto para <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">começar?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
            Conheça o Combo Iniciante Mobile e estude conteúdos práticos de assistência mobile.
          </p>
          <Link
            href={curso.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-9 py-3.5 text-sm font-black uppercase tracking-wide text-[#05070c] shadow-[0_0_32px_rgba(0,212,200,0.3)] transition hover:brightness-110"
          >
            {curso.cta || "Quero meu Combo"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <p className="mt-3 text-xs text-zinc-600">Pagamento seguro • Conteúdo digital</p>
        </div>
      </section>

      {/* ── FOOTER MÍNIMO ────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-[#05070c] py-8">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm font-bold text-white">G•Lab Cursos</p>
            <div className="flex flex-wrap justify-center gap-5 text-xs text-zinc-500 sm:justify-end">
              <Link href="https://www.instagram.com/_gjuliao/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                Instagram @_gjuliao
              </Link>
              <Link href="https://app.kirvano.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                Acessar meu conteúdo
              </Link>
              <Link href="/privacidade" className="hover:text-cyan-400 transition-colors">
                Privacidade
              </Link>
              <Link href="/termos" className="hover:text-cyan-400 transition-colors">
                Termos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
