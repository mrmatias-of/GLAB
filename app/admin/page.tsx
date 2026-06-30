import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, MessageSquare, TrendingUp, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Painel Admin | G•Lab Cursos',
  description: 'Painel administrativo da plataforma de cursos',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-white">Bem-vindo ao painel administrativo</h1>
        <p className="text-slate-400 mt-1 text-sm">Selecione uma seção abaixo para gerenciar cursos, suporte, vendas e configurações</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card Cursos */}
        <Link href="/admin/cursos" className="block">
          <div className="card-elegant bg-slate-900/40 border border-slate-700 hover:border-blue-500/50 transition-all p-4 cursor-pointer">
            <div className="text-blue-400 mb-2">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Cursos</h3>
            <p className="text-slate-400 text-xs">Gerenciar cursos e conteúdo</p>
          </div>
        </Link>

        {/* Card Suporte */}
        <Link href="/admin/suporte" className="block">
          <div className="card-elegant bg-slate-900/40 border border-slate-700 hover:border-blue-500/50 transition-all p-4 cursor-pointer">
            <div className="text-blue-400 mb-2">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Suporte</h3>
            <p className="text-slate-400 text-xs">Gerenciar tickets de suporte</p>
          </div>
        </Link>

        {/* Card Vendas */}
        <Link href="/admin/vendas" className="block">
          <div className="card-elegant bg-slate-900/40 border border-slate-700 hover:border-green-500/50 transition-all p-4 cursor-pointer">
            <div className="text-green-400 mb-2">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Vendas</h3>
            <p className="text-slate-400 text-xs">Relatórios e análises</p>
          </div>
        </Link>

        {/* Card Configurações */}
        <Link href="/admin/configuracoes" className="block">
          <div className="card-elegant bg-slate-900/40 border border-slate-700 hover:border-purple-500/50 transition-all p-4 cursor-pointer">
            <div className="text-purple-400 mb-2">
              <Settings className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Configurações</h3>
            <p className="text-slate-400 text-xs">Ajustes do sistema</p>
          </div>
        </Link>
      </div>

      {/* Info Card */}
      <div className="card-elegant bg-slate-900/40 border border-slate-700 p-4">
        <h2 className="text-base font-semibold text-white mb-2">Dicas de navegação</h2>
        <p className="text-slate-400 mb-3 text-sm">
          Use o menu lateral para acessar rapidamente as seções do painel. Clique em qualquer seção acima ou use o menu para gerenciar diferentes aspectos da plataforma.
        </p>
        <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium transition">
          ← Voltar para home
        </Link>
      </div>
    </div>
  )
}
