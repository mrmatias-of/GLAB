import Header from "@/components/header"
import Footer from "@/components/footer"
import { currentPlatformUser } from "@/lib/learning-platform"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await currentPlatformUser()

  return (
    <div className="min-h-screen flex flex-col text-slate-100" style={{ backgroundColor: '#ffffff' }}>
      <Header isAuthenticated={Boolean(user)} />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}
