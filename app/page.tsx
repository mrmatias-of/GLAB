import Header from "@/components/header"
import Hero from "@/components/hero"
import Footer from "@/components/footer"
import PremiumHomeSections from "@/components/premium-home-sections"
import { currentPlatformUser } from "@/lib/learning-platform"

export default async function Home() {
  const user = await currentPlatformUser()

  return (
    <main className="min-h-screen bg-[#050712] text-white overflow-hidden">
      <Header isAuthenticated={Boolean(user)} />
      <Hero />
      <PremiumHomeSections />
      <Footer />
    </main>
  )
}
