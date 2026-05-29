import Image from "next/image"
import Link from "next/link"
import { Smartphone, ShieldCheck, BookOpen, Check } from "lucide-react"
import ComboAuthoritySection from "./combo-authority-section"
import ComboPurchaseSteps from "./combo-purchase-steps"
import ComboFaq from "./combo-faq"
import type { CursoSerializavel } from "@/lib/cursos-data"

type Props = { curso: CursoSerializavel }

// ──────────────────────────────────────────────
// Defaults seguros para campos opcionais
// ──────────────────────────────────────────────
const DEFAULT_HEADLINE = "Comece na assistência mobile com uma base prática"
const DEFAULT_HEADLINE_SUB =
  "Conteúdos organizados para quem deseja iniciar nos procedimentos essenciais da assistência mobile."
const DEFAULT_CTA = "Quero meu Combo"
const DEFAULT_APRENDIZADOS = [
  "Entender os fundamentos da assistência mobile",
  "Organizar os primeiros procedimentos de bancada",
  "Conhecer etapas essenciais de reparos iniciais",
  "Desenvolver uma base mais clara para praticar",
]

// ──────────────────────────────────────────────
// Botão CTA reutilizável
// ──────────────────────────────────────────────
function CtaButton({
  href,
  label,
  size = "lg",
}: {
  href: string
  label: string
  size?: "lg" | "md"
}) {
  const cls =
    size === "lg"
      ? "inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-black tracking-wide text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      : "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold tracking-wide text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      style={{
        background: "linear-gradient(135deg, #00d4c8 0%, #a855f7 100%)",
        focusOutlineColor: "#00d4c8",
      }}
    >
      {label}
    </a>
  )
}

// ──────────────────────────────────────────────
// Hero
// ──────────────────────────────────────────────
function ComboHero({ curso }: Props) {
  const headline = curso.headline || DEFAULT_HEADLINE
  const headlineSub = curso.headlineSub || DEFAULT_HEADLINE_SUB
  const ctaLabel = curso.cta || DEFAULT_CTA
  const ctaHref = curso.ctaHref
  const hasImage = Boolean(curso.imagem)

  const heroBadges = [
    { icon: BookOpen, label: "Guias técnicos" },
    { icon: Smartphone, label: "Conteúdo prático" },
    { icon: ShieldCheck, label: "Pagamento seguro" },
  ]

  return (
    <section
      className="pt-16 pb-20 px-6"
      style={{ backgroundColor: "#05070c" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Coluna textual */}
          <div className="flex-1 space-y-6">
            {/* Badge superior */}
            <span
              className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
              style={{
                color: "#00d4c8",
                backgroundColor: "rgba(0,212,200,0.1)",
                border: "1px solid rgba(0,212,200,0.2)",
              }}
            >
              Combo Iniciante Mobile
            </span>

            {/* H1 */}
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white text-balance leading-tight"
            >
              {headline}
            </h1>

            {/* Subheadline */}
            <p
              className="text-base md:text-lg leading-relaxed text-pretty"
              style={{ color: "#a1a1aa" }}
            >
              {headlineSub}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {heroBadges.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{
                    color: "#a1a1aa",
                    backgroundColor: "#0a0e16",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <Icon size={12} style={{ color: "#00d4c8" }} />
                  {label}
                </span>
              ))}
            </div>

            {/* Preço */}
            {curso.preco && (
              <div className="flex items-baseline gap-3">
                <span
                  className="text-4xl font-black"
                  style={{ color: "#ffffff" }}
                >
                  {curso.preco}
                </span>
              </div>
            )}

            {/* CTA */}
            {ctaHref && (
              <div className="flex flex-col items-start gap-2">
                <CtaButton href={ctaHref} label={ctaLabel} size="lg" />
                <span className="text-xs" style={{ color: "#52525b" }}>
                  Pagamento seguro • Conteúdo digital
                </span>
              </div>
            )}
          </div>

          {/* Coluna visual */}
          <div className="flex-shrink-0 w-full md:w-72 lg:w-80">
            {hasImage ? (
              <div
                className="relative w-full aspect-square rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(0,212,200,0.2)",
                  boxShadow: "0 0 40px rgba(0,212,200,0.07)",
                }}
              >
                <Image
                  src={curso.imagem!}
                  alt={`Imagem do produto ${curso.titulo}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                  priority
                />
              </div>
            ) : (
              /* Card neutro quando não há imagem */
              <div
                className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-4 p-8 text-center"
                style={{
                  backgroundColor: "#080b12",
                  border: "1px solid rgba(0,212,200,0.15)",
                  boxShadow: "0 0 40px rgba(0,212,200,0.05)",
                }}
              >
                <Smartphone
                  size={48}
                  style={{ color: "rgba(0,212,200,0.4)" }}
                />
                <p className="font-black text-white text-lg leading-tight">
                  Combo Iniciante Mobile
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#71717a" }}>
                  Conteúdo digital para assistência mobile
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// O que você recebe
// ──────────────────────────────────────────────
function ComboWhatYouGet({ curso }: Props) {
  const aprendizados =
    curso.aprendizados && curso.aprendizados.length > 0
      ? curso.aprendizados
      : DEFAULT_APRENDIZADOS

  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: "#080b12" }}
      aria-labelledby="what-you-get-heading"
    >
      <div className="max-w-3xl mx-auto">
        {/* Eyebrow */}
        <p
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: "#00d4c8" }}
        >
          Conteúdo
        </p>
        <h2
          id="what-you-get-heading"
          className="text-2xl md:text-3xl font-black tracking-tight text-white mb-4"
        >
          Uma base organizada para começar
        </h2>
        <p
          className="text-base leading-relaxed mb-10"
          style={{ color: "#a1a1aa" }}
        >
          Estude os principais conceitos e procedimentos apresentados no combo,
          com uma experiência digital objetiva e pensada para a prática.
        </p>

        {/* Lista de aprendizados */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {aprendizados.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl p-4"
              style={{
                backgroundColor: "#0a0e16",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <Check
                size={16}
                className="flex-shrink-0 mt-0.5"
                style={{ color: "#00d4c8" }}
              />
              <span className="text-sm leading-relaxed text-white">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// Card de oferta
// ──────────────────────────────────────────────
function ComboOfferCard({ curso }: Props) {
  const ctaHref = curso.ctaHref
  if (!ctaHref) return null

  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: "#05070c" }}
      aria-label="Oferta do Combo Iniciante Mobile"
    >
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-2xl p-8 text-center space-y-6"
          style={{
            backgroundColor: "#080b12",
            border: "1px solid rgba(0,212,200,0.2)",
            boxShadow: "0 0 48px rgba(0,212,200,0.06)",
          }}
        >
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
            style={{
              color: "#00d4c8",
              backgroundColor: "rgba(0,212,200,0.1)",
              border: "1px solid rgba(0,212,200,0.2)",
            }}
          >
            Comece por aqui
          </span>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            {curso.titulo}
          </h2>

          <p className="text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>
            Conteúdo digital para desenvolver sua base na assistência mobile com
            procedimentos organizados e linguagem direta.
          </p>

          {/* Destaques */}
          <div className="flex justify-center gap-4">
            {["Acesso digital", "Pagamento seguro"].map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{
                  color: "#a1a1aa",
                  backgroundColor: "#0a0e16",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <Check size={11} style={{ color: "#00d4c8" }} />
                {d}
              </span>
            ))}
          </div>

          {/* Preço */}
          {curso.preco && (
            <p className="text-4xl font-black text-white">{curso.preco}</p>
          )}

          {/* CTA */}
          <div className="flex flex-col items-center gap-2">
            <CtaButton href={ctaHref} label="Comprar agora" size="lg" />
            <span className="text-xs" style={{ color: "#52525b" }}>
              Pagamento seguro
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// CTA Final
// ──────────────────────────────────────────────
function ComboFinalCta({ curso }: Props) {
  const ctaHref = curso.ctaHref
  if (!ctaHref) return null

  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: "#080b12" }}
      aria-label="CTA final"
    >
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white text-balance">
          Pronto para começar?
        </h2>
        <p className="text-base leading-relaxed" style={{ color: "#a1a1aa" }}>
          Conheça o Combo Iniciante Mobile e comece a estudar conteúdos práticos
          de assistência mobile.
        </p>
        <div className="flex flex-col items-center gap-2">
          <CtaButton href={ctaHref} label="Quero meu Combo" size="lg" />
          <span className="text-xs" style={{ color: "#52525b" }}>
            Pagamento seguro • Conteúdo digital
          </span>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// Componente raiz da landing
// ──────────────────────────────────────────────
export default function ComboLandingPage({ curso }: Props) {
  return (
    <main>
      <ComboHero curso={curso} />
      <ComboWhatYouGet curso={curso} />
      <ComboAuthoritySection />
      <ComboPurchaseSteps />
      <ComboOfferCard curso={curso} />
      <ComboFaq />
      <ComboFinalCta curso={curso} />
    </main>
  )
}
