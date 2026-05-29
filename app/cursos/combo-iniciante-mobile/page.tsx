import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCursoBySlug, type CursoSerializavel } from "@/lib/cursos-data"
import ComboLandingHeader from "@/components/landing/combo-landing-header"
import ComboLandingPage from "@/components/landing/combo-landing-page"

const SITE_URL = "https://www.glabcursos.com.br"
const SLUG = "combo-iniciante-mobile"

export const metadata: Metadata = {
  title: "Combo Iniciante Mobile",
  description:
    "Conteúdo prático para começar na assistência mobile, criado por Guilherme Julião (GJ).",
  alternates: {
    canonical: `${SITE_URL}/cursos/${SLUG}`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/cursos/${SLUG}`,
    title: "Combo Iniciante Mobile | G•Lab Cursos",
    description:
      "Conteúdo prático para começar na assistência mobile, criado por Guilherme Julião (GJ).",
    images: [
      {
        url: `${SITE_URL}/thumbnail_combo_iniciante_mobile_v3.jpg`,
        width: 1200,
        height: 630,
        alt: "Combo Iniciante Mobile — G•Lab Cursos",
      },
    ],
  },
}

export default async function ComboInicianteMobilePage() {
  const curso = await getCursoBySlug(SLUG)

  if (!curso) notFound()

  const { icon: _icon, ...cursoSerializavel } = curso

  return (
    <>
      <ComboLandingHeader />
      <ComboLandingPage curso={cursoSerializavel as CursoSerializavel} />
    </>
  )
}
