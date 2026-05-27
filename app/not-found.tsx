import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-112px)] flex items-center justify-center px-6 py-20" style={{ backgroundColor: '#0B0B0C' }}>
        <div className="max-w-md w-full text-center">

          {/* Número 404 */}
          <p
            className="text-[120px] font-extrabold leading-none tracking-tighter mb-4 select-none"
            style={{ color: '#1c1c1f' }}
          >
            404
          </p>

          <p className="eyebrow mb-4">Página não encontrada</p>
          <h1 className="text-2xl font-black text-white mb-3 text-balance">
            Essa rota não existe
          </h1>
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#71717a' }}>
            O endereço que você acessou não foi encontrado. Pode ter sido removido, renomeado ou nunca ter existido.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary justify-center">
              <ArrowLeft size={15} />
              Voltar ao início
            </Link>
            <Link href="/cursos" className="btn-outline justify-center">
              <Search size={15} />
              Ver cursos
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
