import Header from "@/components/header"
import Cursos from "@/components/cursos"
import Footer from "@/components/footer"

export const metadata = {
  title: "Guias Técnicos",
  description: "Catálogo completo de guias técnicos: escolha o próximo passo da sua evolução na assistência mobile, diagnóstico avançado, gestão da bancada e PC.",
  alternates: {
    canonical: "https://www.glabcursos.com.br/cursos",
  },
  openGraph: {
    type: "website",
    url: "https://www.glabcursos.com.br/cursos",
    title: "Guias Técnicos | G•Lab Cursos",
    description: "Catálogo completo de guias técnicos: escolha o próximo passo da sua evolução na assistência mobile, diagnóstico avançado, gestão da bancada e PC.",
    images: [
      {
        url: "https://www.glabcursos.com.br/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "G•Lab Cursos — Catálogo de guias técnicos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guias Técnicos | G•Lab Cursos",
    description: "Catálogo completo de guias técnicos: escolha o próximo passo da sua evolução na assistência mobile, diagnóstico avançado, gestão da bancada e PC.",
    images: ["https://www.glabcursos.com.br/og-image.jpg"],
  },
}

export default function CursosPage() {
  return (
    <main className="min-h-screen text-gray-900" style={{ backgroundColor: '#ffffff' }}>
      <Header />

      <section className="pt-24 pb-8 px-6 relative bg-white">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 mb-6">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">Catálogo de guias técnicos</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Escolha o próximo passo da sua{" "}
            <span style={{ color: '#2563eb' }}>evolução</span> na bancada
          </h1>

          <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-2xl">
            Do primeiro reparo ao diagnóstico avançado: encontre o guia ideal para o seu momento na assistência técnica.
          </p>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href="#iniciantes"
              className="px-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-300 text-sm font-semibold"
            >
              Começando na assistência
            </a>
            <a
              href="#diagnostico"
              className="px-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-300 text-sm font-semibold"
            >
              Diagnóstico avançado
            </a>
            <a
              href="#gestao"
              className="px-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-300 text-sm font-semibold"
            >
              Gestão da bancada
            </a>
            <a
              href="#pc-performance"
              className="px-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-300 text-sm font-semibold"
            >
              PC & Performance
            </a>
          </div>
        </div>
      </section>

      {/* Reutiliza o mesmo componente e query que já funcionam na homepage */}
      <Cursos showComunidade={false} />

      <Footer />
    </main>
  )
}
