import ComboLandingHeader from "@/components/landing/combo-landing-header"
import ComboLandingPage from "@/components/landing/combo-landing-page"
import Footer from "@/components/footer"
import type { Metadata } from "next"

const SITE_URL = "https://www.glabcursos.com.br"

export const metadata: Metadata = {
  title: "Combo Iniciante Mobile | G•Lab Cursos",
  description:
    "Conteúdo prático para começar na assistência mobile, criado por Guilherme Julião (GJ).",
  alternates: { canonical: `${SITE_URL}/cursos/combo-iniciante-mobile` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/cursos/combo-iniciante-mobile`,
    title: "Combo Iniciante Mobile | G•Lab Cursos",
    description:
      "Conteúdo prático para começar na assistência mobile, criado por Guilherme Julião (GJ).",
    images: [{ url: `${SITE_URL}/images/combo/combo-iniciante.webp`, width: 1200, height: 630, alt: "Combo Iniciante Mobile" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Combo Iniciante Mobile | G•Lab Cursos",
    description:
      "Conteúdo prático para começar na assistência mobile, criado por Guilherme Julião (GJ).",
    images: [`${SITE_URL}/images/combo/combo-iniciante.webp`],
  },
}

export default function ComboInicianteMobilePage() {
  return (
    <>
      <ComboLandingHeader />
      <ComboLandingPage
        curso={{
          titulo: "Combo Iniciante Mobile",
          ctaHref: "https://pay.kirvano.com/d910bfe5-d8cb-460c-97a6-4af98346b660",
          imagem: "/images/combo/combo-iniciante.webp",
          preco: "Consultar preço",
          headline: "Comece na assistência mobile com uma base prática",
          headlineSub: "Conteúdos organizados para iniciar nos procedimentos essenciais",
        }}
      />
      <Footer />
    </>
  )
}
