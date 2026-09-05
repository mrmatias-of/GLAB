import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Cpu,
  GraduationCap,
  Layers3,
  Laptop,
  Radio,
  Settings2,
  ShieldCheck,
  Smartphone,
  Wrench,
} from "lucide-react"
import { CATALOGO, type Trilha } from "@/lib/catalogo"

export const metadata: Metadata = {
  title: "Cursos de Assistência Técnica | G·LAB",
  description: "Formações práticas em reparo mobile, diagnóstico, gestão e performance.",
}

const trilhas: Array<{
  id: Trilha
  titulo: string
  curto: string
  texto: string
  cor: string
  icon: typeof Wrench
}> = [
  { id: "fundamentos", titulo: "Fundamentos da bancada", curto: "Base", texto: "Rotina, instrumentos, segurança e primeiros diagnósticos.", cor: "text-cyan-300", icon: Wrench },
  { id: "reparos", titulo: "Reparos e periféricos", curto: "Reparo", texto: "Telas, baterias, conectores, sensores e recuperação.", cor: "text-emerald-300", icon: Smartphone },
  { id: "diagnostico", titulo: "Diagnóstico e placa", curto: "Placa", texto: "Medições, consumo, esquemas e falhas complexas.", cor: "text-sky-300", icon: Cpu },
  { id: "microsolda", titulo: "Microsolda e componentes", curto: "Solda", texto: "SMD, trilhas, BGA, conectores e controle térmico.", cor: "text-amber-300", icon: Radio },
  { id: "apple", titulo: "Especialização Apple", curto: "Apple", texto: "iPhone, panic logs, Face ID, carga e placas multicamadas.", cor: "text-violet-300", icon: Smartphone },
  { id: "software", titulo: "Software e dados", curto: "Dados", texto: "Firmware, restauração, backup e privacidade.", cor: "text-lime-300", icon: Settings2 },
  { id: "gestao", titulo: "Gestão profissional", curto: "Gestão", texto: "Preço, OS, garantia, estoque, atendimento e marketing.", cor: "text-orange-300", icon: Layers3 },
  { id: "performance", titulo: "PC & Performance", curto: "PC", texto: "Hardware, notebooks, Windows e otimização real.", cor: "text-fuchsia-300", icon: Laptop },
]

const cursosPorTrilha = trilhas.map((trilha) => ({
  ...trilha,
  produtos: CATALOGO.filter((curso) => curso.trilha === trilha.id),
}))

const destaques = CATALOGO.filter((curso) => curso.destaque).slice(0, 6)
const totalModulos = CATALOGO.reduce((total, curso) => total + curso.modulos.length, 0)

const nivelStyle = {
  Iniciante: "border-emerald-300/35 bg-emerald-300/10 text-emerald-200",
  Intermediário: "border-cyan-300/35 bg-cyan-300/10 text-cyan-200",
  Avançado: "border-violet-300/35 bg-violet-300/10 text-violet-200",
} as const

export default function CursosPage() {
  return (
    <main className="min-h-screen bg-[#070809] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_85%_15%,rgba(34,211,238,.16),transparent_32%),linear-gradient(180deg,#111419_0%,#070809_82%)] px-5 pt-16 md:px-8 md:pt-24">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-10 pb-14 lg:grid-cols-[1fr_460px] lg:items-end lg:pb-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-md border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[.2em] text-cyan-200">
              <BookOpen size={14} />
              Academia técnica G·LAB
            </span>
            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[.92] sm:text-6xl lg:text-[82px]">
              Formação técnica com padrão de laboratório.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
              Catálogo completo para assistência mobile, placa, software, gestão e performance. Cada curso entra como uma etapa real da bancada.
            </p>
            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 text-sm text-zinc-200 sm:grid-cols-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[.04] px-3 py-3">
                <BadgeCheck size={16} className="text-emerald-300" />
                {CATALOGO.length} formações
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[.04] px-3 py-3">
                <ShieldCheck size={16} className="text-cyan-300" />
                8 trilhas
              </span>
              <span className="col-span-2 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[.04] px-3 py-3 sm:col-span-1">
                <GraduationCap size={16} className="text-amber-300" />
                {totalModulos} módulos
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-black/20 p-3 shadow-2xl shadow-black/30">
            {trilhas.map((trilha) => {
              const Icon = trilha.icon
              const total = CATALOGO.filter((curso) => curso.trilha === trilha.id).length

              return (
                <a
                  key={trilha.id}
                  href={`#${trilha.id}`}
                  className="group rounded-lg border border-white/10 bg-white/[.055] p-4 transition hover:border-cyan-300/35 hover:bg-white/[.09]"
                >
                  <div className="flex items-center justify-between">
                    <Icon size={17} className={trilha.cor} />
                    <span className="text-xs font-black text-white/45">{String(total).padStart(2, "0")}</span>
                  </div>
                  <strong className="mt-4 block text-sm font-black text-white group-hover:text-cyan-100">{trilha.curto}</strong>
                  <span className="mt-1 block text-xs text-zinc-500">{trilha.titulo}</span>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-5 py-10 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-end justify-between gap-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.22em] text-cyan-300">Comece por aqui</p>
              <h2 className="mt-2 text-2xl font-black md:text-3xl">Formações em destaque</h2>
            </div>
            <Link href="#fundamentos" className="hidden items-center gap-2 text-sm font-bold text-zinc-300 hover:text-white md:inline-flex">
              Ver catálogo completo
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {destaques.map((curso, index) => (
              <Link
                key={curso.id}
                href={`/cursos/${curso.slug}`}
                className="group grid overflow-hidden rounded-lg border border-white/10 bg-[#111418] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-300/35 md:grid-cols-[190px_1fr]"
              >
                <div className="relative aspect-[16/10] bg-zinc-950 md:aspect-auto">
                  <Image
                    src={curso.imagem}
                    alt={curso.titulo}
                    fill
                    priority={index < 3}
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 767px) calc(100vw - 40px), 160px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[.16em] text-cyan-300">{curso.id}</span>
                    <span className={`rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-[.12em] ${nivelStyle[curso.nivel]}`}>
                      {curso.nivel}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-black leading-tight">{curso.titulo}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{curso.descricao}</p>
                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-zinc-300">
                    <span>{curso.cargaHoraria}</span>
                    <span>{curso.modulos.length} módulos</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-18">
        {cursosPorTrilha.map((trilha, trilhaIndex) => {
          const Icon = trilha.icon

          return (
            <div id={trilha.id} key={trilha.id} className={`${trilhaIndex ? "mt-20" : ""} scroll-mt-24`}>
              <div className="mb-6 grid gap-4 border-b border-white/10 pb-5 md:grid-cols-[1fr_auto] md:items-end">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[.04]">
                    <Icon size={21} className={trilha.cor} />
                  </div>
                  <div>
                    <p className={`text-[11px] font-black uppercase tracking-[.2em] ${trilha.cor}`}>{trilha.curto}</p>
                    <h2 className="mt-1 text-2xl font-black md:text-3xl">{trilha.titulo}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{trilha.texto}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-zinc-500">{trilha.produtos.length} cursos</span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {trilha.produtos.map((curso) => (
                  <Link
                    key={curso.id}
                    href={`/cursos/${curso.slug}`}
                    className="group overflow-hidden rounded-xl border border-white/10 bg-[#111418] shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-[#151a20]"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-zinc-950">
                      <Image
                        src={curso.imagem}
                        alt={curso.titulo}
                        fill
                        loading={Number(curso.id) <= 12 ? "eager" : "lazy"}
                        className="object-cover object-center transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                      <div className="absolute left-3 top-3 rounded-md border border-white/15 bg-black/65 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[.12em] text-white backdrop-blur">
                        {curso.id}
                      </div>
                      {curso.destaque && (
                        <div className="absolute right-3 top-3 rounded-md bg-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[.12em] text-black">
                          Destaque
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                        <span className={`rounded-md border px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[.12em] backdrop-blur ${nivelStyle[curso.nivel]}`}>
                          {curso.nivel}
                        </span>
                        <span className="rounded-md border border-white/15 bg-black/60 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[.12em] text-white backdrop-blur">
                          {curso.cargaHoraria}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[.18em] text-zinc-500">
                        <span>G·LAB</span>
                        <span>{curso.modulos.length} módulos</span>
                      </div>
                      <h3 className="mt-3 text-xl font-black leading-tight text-white group-hover:text-cyan-100">{curso.titulo}</h3>
                      <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">{curso.descricao}</p>
                      <div className="mt-5 grid gap-2 border-t border-white/10 pt-4">
                        {curso.modulos.slice(0, 3).map((modulo) => (
                          <span key={modulo} className="flex items-center gap-2 text-xs leading-5 text-zinc-300">
                            <CheckCircle2 size={13} className={trilha.cor} />
                            {modulo}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-xs font-black uppercase tracking-[.14em] text-zinc-200">Abrir formação</span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
                          <ArrowUpRight size={15} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}
