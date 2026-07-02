'use client'

import Link from 'next/link'

export default function PlansManagement() {
  const plans = [
    { id: 1, name: 'Starter', price: 'R$ 99/mês', users: 5, storage: 10 },
    { id: 2, name: 'Professional', price: 'R$ 299/mês', users: 25, storage: 100 },
    { id: 3, name: 'Enterprise', price: 'Customizado', users: 'Ilimitado', storage: 'Ilimitado' },
  ]

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gerenciamento de Planos</h1>
            <p className="text-slate-600 mt-1">Crie e configure planos de preço</p>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Novo Plano
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{plan.price}</p>
              <ul className="mt-6 space-y-2">
                <li className="text-sm text-slate-600">Até {plan.users} usuários</li>
                <li className="text-sm text-slate-600">{plan.storage} GB armazenamento</li>
              </ul>
              <button className="w-full mt-6 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Editar
              </button>
            </div>
          ))}
        </div>

        <Link href="/master">
          <div className="mt-8 inline-block">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              ← Voltar para Master
            </button>
          </div>
        </Link>
      </div>
    </div>
  )
}
