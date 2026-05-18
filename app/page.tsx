import Header from "@/components/header"
import Hero from "@/components/hero"
import Stats from "@/components/stats"
import Cursos from "@/components/cursos"
import Footer from "@/components/footer"
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Stats />
      <Cursos />
      <Footer />
    </main>
  )
}
