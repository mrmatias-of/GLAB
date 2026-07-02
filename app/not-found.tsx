import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="bg-slate-950 text-slate-50 min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center">
          <p className="text-6xl md:text-7xl font-bold mb-6 text-blue-400">404</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Página não encontrada</h1>
          <p className="text-slate-400 mb-8">
            O endereço que você acessou não existe. Volte à home e continue explorando.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-slate-50 rounded-lg font-medium hover:bg-blue-500 transition-colors">
            <ArrowLeft size={18} />
            Voltar ao início
          </Link>
        </div>
      </main>
    </div>
  )
}
