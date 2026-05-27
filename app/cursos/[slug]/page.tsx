import { notFound } from "next/navigation"
import { getCursoBySlug, getCursoSlugs, getCursos } from "@/lib/cursos-data"
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

  return (
    <>
      <Header />
      <main>
        {/* 1. Hero do produto */}
        <ProductHero curso={curso} />

        {/* 2. Faixa de informações rápidas */}
        <ProductQuickInfo curso={curso} />

        {/* 3. Identificação do problema — "Este guia é para você se:" */}
        <ProductAudienceSection curso={curso} />

        {/* 4. Resultado técnico — "Ao estudar este guia, você poderá:" */}
        <ProductOutcomesSection curso={curso} />

        {/* 5. Conteúdo do guia — módulos e tópicos */}
        <ProductCurriculumSection curso={curso} />

        {/* 6. O que você recebe */}
        <ProductDeliverablesSection curso={curso} />

        {/* 7. Oferta intermediária */}
        <ProductOfferCard curso={curso} />

        {/* 8. FAQ */}
        <ProductFaqSection curso={curso} />

        {/* 9. CTA final */}
        <ProductFinalCTA curso={curso} />

        {/* 10. Produtos relacionados */}
        <RelatedProductsSection curso={curso} todosCursos={todosCursos} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
