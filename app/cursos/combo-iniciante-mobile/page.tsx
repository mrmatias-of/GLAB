import { notFound } from "next/navigation"
import { getCursoBySlug } from "@/lib/cursos-data"
import ComboLandingHeader from "@/components/landing/combo-landing-header"
import ComboLandingPage from "@/components/landing/combo-landing-page"
import Footer from "@/components/footer"
import type { Metadata } from "next"
import type { CursoSerializavel } from "@/lib/cursos-data"

const SITE_URL = "https://www.glabcursos.com.br"
const SLUG = "combo-iniciante-mobile"

export async function generateMetadata(): Promise<Metadata> {
  const curso = await getCursoBySlug(SLUG)
  const pageUrl = `${SITE_URL}/cursos/${SLUG}`

  const ogImage = curso?.imagem
    ? { url: curso.imagem, width: 1200, height: 630, alt: curso.titulo }
    : { url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Combo Iniciante Mobile" }

  return {
    title: "Combo Iniciante Mobile | G•Lab Cursos",
    description:
      "Conteúdo prático para começar na assistência mobile, criado por Guilherme Julião (GJ).",
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: "Combo Iniciante Mobile | G•Lab Cursos",
      description:
        "Conteúdo prático para começar na assistência mobile, criado por Guilherme Julião (GJ).",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Combo Iniciante Mobile | G•Lab Cursos",
      description:
        "Conteúdo prático para começar na assistência mobile, criado por Guilherme Julião (GJ).",
      images: [ogImage.url],
    },
  }
}

export default async function ComboInicianteMobilePage() {
  const curso = await getCursoBySlug(SLUG)

  if (!curso) notFound()

  // Remove o campo `icon` (LucideIcon function) para evitar erro de serialização
  const { icon: _icon, ...cursoSerializavel } = curso
  const cs = cursoSerializavel as CursoSerializavel

  return (
    <>
      <ComboLandingHeader />
      <ComboLandingPage curso={cs} />
      <Footer />
    </>
  )
}
