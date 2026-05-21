import Header from "@/components/header"
import Cursos from "@/components/cursos"
import Footer from "@/components/footer"

export const metadata = {
  title: "Cursos — G•Lab Guias Mestre",
  description: "Todos os guias técnicos de assistência disponíveis: iPhone, Android, Windows e muito mais.",
}

export default function CursosPage() {
  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: '#0B0B0C' }}>
      <Header />

      <section className="pt-28 pb-6 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="eyebrow mb-3">Catálogo completo</p>
          <h1 className="section-title mb-4 text-balance">
            Todos os Guias
          </h1>
          <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color: '#71717a' }}>
            Conteúdo prático, direto ao ponto — criado por quem já reparou mais de 20.000 aparelhos.
          </p>
        </div>
      </section>

      <Cursos />
      <Footer />
    </main>
  )
}
