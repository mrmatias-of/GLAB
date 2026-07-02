'use client'

import Link from 'next/link'

export default function FeatureFlagsManagement() {
  const features = [
    { key: 'rh_module', name: 'Módulo RH', description: 'Gestão de funcionários e folha de pagamento' },
    { key: 'crm_module', name: 'Módulo CRM', description: 'Gerenciamento de clientes e relacionamento' },
    { key: 'agenda_module', name: 'Módulo Agenda', description: 'Agendamento e calendário' },
    { key: 'compras_module', name: 'Módulo Compras', description: 'Gestão de compras e fornecedores' },
    { key: 'nota_fiscal_module', name: 'Integração NF-e', description: 'Emissão de notas fiscais' },
    { key: 'marketplace', name: 'Marketplace', description: 'Extensões e integrações' },
  ]

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Feature Flags</h1>

        <div className="space-y-4">
          {features.map((feature) => (
            <div key={feature.key} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{feature.name}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
              <button className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors">
                Configurar
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
