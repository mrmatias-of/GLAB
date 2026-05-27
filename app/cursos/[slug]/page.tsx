import { notFound } from "next/navigation"
import { getCursoBySlug, getCursoSlugs, getCursos, type CursoSerializavel } from "@/lib/cursos-data"
import Header from "@/components/header"
import Footer from "@/components/footer"
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

const SITE_URL = 'https://www.glabcursos.com.br'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const curso = await getCursoBySlug(slug)
  if (!curso) return {}

  const pageUrl = `${SITE_URL}/cursos/${slug}`
  const description = curso.descricaoLonga || curso.descricao

  // Usa a imagem do produto se disponível; caso contrário, og-image padrão
  const ogImage = curso.imagem
    ? { url: curso.imagem, width: 1200, height: 630, alt: curso.titulo }
    : { url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: curso.titulo }

  // Metadata específica para Combo Iniciante
  if (slug === "combo-iniciante-mobile") {
    return {
      title: "Combo Iniciante Mobile",
      description: "Comece na assistência técnica mobile com conteúdos práticos sobre tela, bateria, conector e fundamentos de bancada.",
      alternates: { canonical: pageUrl },
      openGraph: {
        type: 'website',
        url: pageUrl,
        title: "Combo Iniciante Mobile | G•Lab Cursos",
        description: "Comece na assistência técnica mobile com conteúdos práticos sobre tela, bateria, conector e fundamentos de bancada.",
        images: [ogImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: "Combo Iniciante Mobile | G•Lab Cursos",
        description: "Comece na assistência técnica mobile com conteúdos práticos sobre tela, bateria, conector e fundamentos de bancada.",
        images: [ogImage.url],
      },
    }
  }

  return {
    title: curso.titulo,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'website',
      url: pageUrl,
      title: `${curso.titulo} | G•Lab Cursos`,
      description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${curso.titulo} | G•Lab Cursos`,
      description,
      images: [ogImage.url],
    },
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
    </>
  )
}
