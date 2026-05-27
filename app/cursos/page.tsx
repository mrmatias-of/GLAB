import Header from "@/components/header"
import Cursos from "@/components/cursos"
import Footer from "@/components/footer"

export const metadata = {
  title: "Cursos - G•Lab Cursos",
  description: "Todos os cursos técnicos de assistência disponíveis: iPhone, Android, Windows e muito mais.",
}

export default function CursosPage() {
  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: '#050510' }}>
      <Header />

      <section className="pt-28 pb-10 px-6 relative">
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

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 mb-6">
            <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">Catálogo completo</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Todos os{" "}
            <span className="text-cyan-400" style={{ textShadow: '0 0 30px rgba(0,212,200,0.5)' }}>Cursos</span>
          </h1>
          
          <p className="text-base text-white/50 leading-relaxed max-w-xl mx-auto">
            Conteúdo prático, direto ao ponto - criado por quem já reparou mais de 20.000 aparelhos.
          </p>
        </div>
      </section>

      <Cursos />
      <Footer />
    </main>
  )
}
