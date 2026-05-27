import { notFound } from "next/navigation"
import { getCursoBySlug, getCursoSlugs, getCursos, type CursoSerializavel } from "@/lib/cursos-data"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import ProductHero from "@/components/produto/product-hero"
import ProductQuickInfo from "@/components/produto/product-quick-info"
import ProductAudienceSection from "@/components/produto/product-audience-section"
import ProductOutcomesSection from "@/components/produto/product-outcomes-section"
import ProductCurriculumSection from "@/components/produto/product-curriculum-section"
import ProductDeliverablesSection from "@/components/produto/product-deliverables-section"
import ProductOfferCard from "@/components/produto/product-offer-card"
import ProductFaqSection from "@/components/produto/product-faq-section"
import ProductFinalCTA from "@/components/produto/product-final-cta"
import RelatedProductsSection from "@/components/produto/related-products-section"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const curso = await getCursoBySlug(slug)
  if (!curso) return {}

  // Metadata específica para Combo Iniciante
  if (slug === "combo-iniciante-mobile") {
    return {
      title: "Combo Iniciante Mobile | G•Lab Cursos",
      description: "Comece na assistência técnica mobile com conteúdos práticos sobre tela, bateria, conector e fundamentos de bancada.",
    }
  }

  return {
    title: `${curso.titulo} — G•Lab Cursos`,
    description: curso.descricaoLonga || curso.descricao,
  }
}

export async function generateStaticParams() {
  const slugs = await getCursoSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function PaginaCurso({ params }: Props) {
  const { slug } = await params
  const [curso, todosCursos] = await Promise.all([
    getCursoBySlug(slug),
    getCursos(),
  ])

  if (!curso) notFound()

  // Remove o campo `icon` (LucideIcon function) para evitar erro de serialização
  // ao passar de Server Component para Client Components
  const { icon: _icon, ...cursoSerializavel } = curso
  const cs = cursoSerializavel as CursoSerializavel
  const todosCursosSerializaveis = todosCursos.map(({ icon: _i, ...rest }) => rest as CursoSerializavel)

  return (
    <>
      <Header />
      <main>
        {/* 1. Hero do produto */}
        <ProductHero curso={cs} />

        {/* 2. Faixa de informações rápidas */}
        <ProductQuickInfo curso={cs} />

        {/* 3. Identificação do problema — "Este guia é para você se:" */}
        <ProductAudienceSection curso={cs} />

        {/* 4. Resultado técnico — "Ao estudar este guia, você poderá:" */}
        <ProductOutcomesSection curso={cs} />

        {/* 5. Conteúdo do guia — módulos e tópicos */}
        <ProductCurriculumSection curso={cs} />

        {/* 6. O que você recebe */}
        <ProductDeliverablesSection curso={cs} />

        {/* 7. Oferta intermediária */}
        <ProductOfferCard curso={cs} />

        {/* 8. FAQ */}
        <ProductFaqSection curso={cs} />

        {/* 9. CTA final */}
        <ProductFinalCTA curso={cs} />

        {/* 10. Produtos relacionados */}
        <RelatedProductsSection curso={cs} todosCursos={todosCursosSerializaveis} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
