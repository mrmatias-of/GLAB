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
    <main className="min-h-screen text-white" style={{ backgroundColor: '#050510' }}>
      <Header />

      <section className="pt-24 pb-8 px-6 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(0,212,200,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,200,.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-30" style={{
            background: 'radial-gradient(circle, rgba(0,212,200,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)'
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 mb-6">
            <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">Catálogo de guias técnicos</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Escolha o próximo passo da sua{" "}
            <span className="text-cyan-400" style={{ textShadow: '0 0 30px rgba(0,212,200,0.5)' }}>evolução</span> na bancada
          </h1>

          <p className="text-base text-white/50 leading-relaxed mb-8 max-w-2xl">
            Do primeiro reparo ao diagnóstico avançado: encontre o guia ideal para o seu momento na assistência técnica.
          </p>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href="#iniciantes"
              className="px-4 py-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300 text-sm font-semibold"
            >
              Começando na assistência
            </a>
            <a
              href="#diagnostico"
              className="px-4 py-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300 text-sm font-semibold"
            >
              Diagnóstico avançado
            </a>
            <a
              href="#gestao"
              className="px-4 py-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300 text-sm font-semibold"
            >
              Gestão da bancada
            </a>
            <a
              href="#pc-performance"
              className="px-4 py-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300 text-sm font-semibold"
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
