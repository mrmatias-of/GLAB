import Header from "@/components/header"
import Hero from "@/components/hero"
import Footer from "@/components/footer"
import PremiumHomeSections from "@/components/premium-home-sections"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050712] text-white overflow-hidden">
      <Header />
      <Hero />
      <PremiumHomeSections />
      <Footer />
    </main>
  )
}
