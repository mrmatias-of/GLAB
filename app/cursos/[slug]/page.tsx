import { notFound } from "next/navigation"
import { getCursoBySlug, getCursoSlugs } from "@/lib/cursos-data"
import CursoHero from "@/components/curso-hero"
import CursoModulos from "@/components/curso-modulos"
import CursoAprendizados from "@/components/curso-aprendizados"
import CursoCTA from "@/components/curso-cta"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const curso = await getCursoBySlug(slug)
  if (!curso) return {}
  return {
    title: `${curso.titulo} — G•Lab Cursos`,
    description: curso.descricaoLonga,
  }
}

export async function generateStaticParams() {
  const slugs = await getCursoSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function PaginaCurso({ params }: Props) {
  const { slug } = await params
  const curso = await getCursoBySlug(slug)
  if (!curso) notFound()

  return (
    <>
      <Header />
      <main>
        <CursoHero curso={curso} />
        <CursoAprendizados curso={curso} />
        <CursoModulos curso={curso} />
        <CursoCTA curso={curso} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
