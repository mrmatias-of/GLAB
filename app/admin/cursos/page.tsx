import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cursos | Painel Admin',
  description: 'Gerenciar cursos',
}

export default function CursosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-medium mb-6 inline-block">
          ← Voltar para painel
        </Link>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Gerenciamento de Cursos</h1>
        <p className="text-slate-600 mb-8">Criar, editar e gerenciar cursos</p>

        <div className="card-elegant bg-slate-900/40 p-4 text-center">
          <p className="text-slate-600 mb-4">Seção em desenvolvimento</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
            + Novo Curso
          </button>
        </div>
      </div>
    </div>
  )
}
