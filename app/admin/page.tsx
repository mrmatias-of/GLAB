import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, MessageSquare, TrendingUp, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Painel Admin | G•Lab Cursos',
  description: 'Painel administrativo da plataforma de cursos',
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">G•Lab Cursos</h1>
            <p className="text-slate-600">Painel Administrativo</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">admin@glabcursos.com</span>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card Cursos */}
          <Link href="/admin/cursos" className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer">
              <div className="text-cyan-600 mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Cursos</h3>
              <p className="text-slate-600 text-sm">Gerenciar cursos e conteúdo</p>
            </div>
          </Link>

          {/* Card Suporte */}
          <Link href="/admin/suporte" className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer">
              <div className="text-blue-600 mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Suporte</h3>
              <p className="text-slate-600 text-sm">Gerenciar tickets de suporte</p>
            </div>
          </Link>

          {/* Card Vendas */}
          <Link href="/admin/vendas" className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer">
              <div className="text-green-600 mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Vendas</h3>
              <p className="text-slate-600 text-sm">Relatórios e análises</p>
            </div>
          </Link>

          {/* Card Configurações */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-purple-600 mb-4">
              <Settings className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Configurações</h3>
            <p className="text-slate-600 text-sm">Ajustes do sistema</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Bem-vindo ao painel administrativo</h2>
          <p className="text-slate-600 mb-4">
            Selecione uma seção acima para gerenciar cursos, suporte, vendas e configurações.
          </p>
          <Link href="/" className="text-cyan-600 hover:text-cyan-700 font-medium">
            ← Voltar para home
          </Link>
        </div>
      </div>
    </div>
  )
}
