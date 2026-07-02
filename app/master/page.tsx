import Link from 'next/link'

export default function MasterDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">GLAB ERP Master Console</h1>
          <p className="text-slate-400">Gerenciamento centralizado de tenants, planos e features</p>
        </div>

        {/* Master Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tenants Management */}
          <Link href="/master/tenants">
            <div className="group p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                Tenants
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Gerenciar empresas, ativar/desativar, visualizar métricas
              </p>
            </div>
          </Link>

          {/* Plans Management */}
          <Link href="/master/plans">
            <div className="group p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-green-500/50 hover:shadow-lg transition-all cursor-pointer">
              <div className="text-3xl mb-3">💎</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors">
                Planos
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Criar, editar e gerenciar planos de preço
              </p>
            </div>
          </Link>

          {/* Feature Flags */}
          <Link href="/master/features">
            <div className="group p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-purple-500/50 hover:shadow-lg transition-all cursor-pointer">
              <div className="text-3xl mb-3">🚩</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                Feature Flags
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Controlar módulos e features por plano
              </p>
            </div>
          </Link>

          {/* Subscriptions */}
          <Link href="/master/subscriptions">
            <div className="group p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 hover:shadow-lg transition-all cursor-pointer">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Subscriptions
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Gerenciar subscrições ativas e trials
              </p>
            </div>
          </Link>

          {/* Users Management */}
          <Link href="/master/users">
            <div className="group p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-yellow-500/50 hover:shadow-lg transition-all cursor-pointer">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-yellow-300 transition-colors">
                Usuários Master
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Gerenciar admins e usuários de suporte
              </p>
            </div>
          </Link>

          {/* Analytics & Reports */}
          <Link href="/master/analytics">
            <div className="group p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-red-500/50 hover:shadow-lg transition-all cursor-pointer">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-red-300 transition-colors">
                Analytics
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Dashboards, relatórios e métricas de plataforma
              </p>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-slate-400 text-sm">Total Tenants</p>
            <p className="text-2xl font-bold text-white mt-2">--</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-slate-400 text-sm">Active Subscriptions</p>
            <p className="text-2xl font-bold text-white mt-2">--</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-slate-400 text-sm">MRR</p>
            <p className="text-2xl font-bold text-white mt-2">--</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-slate-400 text-sm">Churn Rate</p>
            <p className="text-2xl font-bold text-white mt-2">--</p>
          </div>
        </div>
      </div>
    </div>
  )
}
