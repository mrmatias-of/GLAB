import Header from "@/components/header"
import Hero from "@/components/hero"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen text-gray-900" style={{ backgroundColor: '#ffffff' }}>
      <Header />
      <Hero />
      <Footer />
    </main>
  )
}
