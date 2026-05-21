import Header from "@/components/header"
import Hero from "@/components/hero"
import Stats from "@/components/stats"
import CursosPreview from "@/components/cursos-preview"
import Depoimentos from "@/components/depoimentos"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      <Stats />
      <CursosPreview />
      <Depoimentos />
      <Footer />
    </main>
  )
}
