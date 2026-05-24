import Header from "@/components/header"
import Hero from "@/components/hero"
import Cursos from "@/components/cursos"
import Beneficios from "@/components/beneficios"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: '#050510' }}>
      <Header />
      <Hero />
      <Cursos />
      <Beneficios />
      <Footer />
    </main>
  )
}
