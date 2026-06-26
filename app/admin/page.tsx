import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, MessageSquare, TrendingUp, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Painel Admin | G•Lab Cursos',
  description: 'Painel administrativo da plataforma de cursos',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-white">Bem-vindo ao painel administrativo</h1>
        <p className="text-slate-400 mt-2">Selecione uma seção abaixo para gerenciar cursos, suporte, vendas e configurações</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Cursos */}
        <Link href="/admin/cursos" className="block">
          <div className="card-elegant bg-slate-900/40 border border-slate-700 hover:border-cyan-500/50 transition-all p-6 cursor-pointer">
            <div className="text-cyan-400 mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Cursos</h3>
            <p className="text-slate-400 text-sm">Gerenciar cursos e conteúdo</p>
          </div>
        </Link>

        {/* Card Suporte */}
        <Link href="/admin/suporte" className="block">
          <div className="card-elegant bg-slate-900/40 border border-slate-700 hover:border-blue-500/50 transition-all p-6 cursor-pointer">
            <div className="text-blue-400 mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Suporte</h3>
            <p className="text-slate-400 text-sm">Gerenciar tickets de suporte</p>
          </div>
        </Link>

        {/* Card Vendas */}
        <Link href="/admin/vendas" className="block">
          <div className="card-elegant bg-slate-900/40 border border-slate-700 hover:border-green-500/50 transition-all p-6 cursor-pointer">
            <div className="text-green-400 mb-4">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Vendas</h3>
            <p className="text-slate-400 text-sm">Relatórios e análises</p>
          </div>
        </Link>

        {/* Card Configurações */}
        <Link href="/admin/configuracoes" className="block">
          <div className="card-elegant bg-slate-900/40 border border-slate-700 hover:border-purple-500/50 transition-all p-6 cursor-pointer">
            <div className="text-purple-400 mb-4">
              <Settings className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Configurações</h3>
            <p className="text-slate-400 text-sm">Ajustes do sistema</p>
          </div>
        </Link>
      </div>

      {/* Info Card */}
      <div className="card-elegant bg-slate-900/40 border border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-3">Dicas de navegação</h2>
        <p className="text-slate-400 mb-4">
          Use o menu lateral para acessar rapidamente as seções do painel. Clique em qualquer seção acima ou use o menu para gerenciar diferentes aspectos da plataforma.
        </p>
        <Link href="/" className="text-cyan-400 hover:text-cyan-300 font-medium transition">
          ← Voltar para home
        </Link>
      </div>
    </div>
  )
}
