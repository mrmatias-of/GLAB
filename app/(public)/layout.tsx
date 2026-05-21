import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col text-white" style={{ backgroundColor: '#0B0B0C' }}>
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}
