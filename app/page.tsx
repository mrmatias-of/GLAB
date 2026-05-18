import Header from "@/components/header"
import Hero from "@/components/hero"
import Stats from "@/components/stats"
import Professor from "@/components/professor"
import Cursos from "@/components/cursos"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Stats />
      <Professor />
      <Cursos />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
