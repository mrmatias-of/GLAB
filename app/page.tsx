import Header from "@/components/header"
import Hero from "@/components/hero"
import Cursos from "@/components/cursos"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen text-gray-900" style={{ backgroundColor: '#ffffff' }}>
      <Header />
      <Hero />
      <Cursos showComunidade={true} />
      <Footer />
    </main>
  )
}
