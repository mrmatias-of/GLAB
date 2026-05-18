import Header from "@/components/header"
import Cursos from "@/components/cursos"
import Footer from "@/components/footer"

export const metadata = {
  title: "Cursos — G•Lab Guias Mestre",
  description: "Todos os guias técnicos de assistência disponíveis: iPhone, Android, Windows e muito mais.",
}

export default function CursosPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Page hero */}
      <section className="relative pt-32 pb-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(0,212,200,0.1)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,212,200,0.35) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/8 px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-glow" />
            <span className="text-xs font-semibold tracking-[0.18em] text-cyan uppercase">Todos os Guias</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-balance mb-4">
            Guias para{" "}
            <span className="text-cyan glow-text">Assistência Técnica</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Conteúdo prático, direto ao ponto — criado por quem já reparou mais de 20.000 aparelhos.
          </p>
        </div>
      </section>

      <Cursos />
      <Footer />
    </main>
  )
}
