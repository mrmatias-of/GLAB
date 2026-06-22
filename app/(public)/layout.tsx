import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col text-gray-900" style={{ backgroundColor: '#ffffff' }}>
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}
