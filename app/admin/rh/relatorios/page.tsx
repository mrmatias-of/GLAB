'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RelatoriosRHPage() {
  const [tipoRelatorio, setTipoRelatorio] = useState('folha')
  const [loading, setLoading] = useState(false)

  const relatorios = [
    {
      id: 'folha',
      nome: 'Folha de Pagamento',
      descricao: 'Relatório detalhado de folha com proventos e descontos',
      icon: '📊'
    },
    {
      id: 'impostos',
      nome: 'Impostos Retidos',
      descricao: 'Resumo de INSS, IRPF e FGTS retidos',
      icon: '💰'
    },
    {
      id: 'fgts',
      nome: 'FGTS Acumulado',
      descricao: 'Saldo de FGTS por funcionário',
      icon: '🏦'
    },
    {
      id: 'banco-horas',
      nome: 'Banco de Horas',
      descricao: 'Resumo de saldos de banco de horas',
      icon: '⏱️'
    },
    {
      id: 'funcarios-ativos',
      nome: 'Funcionários Ativos',
      descricao: 'Lista de funcionários com informações salariais',
      icon: '👥'
    },
    {
      id: 'encargos',
      nome: 'Encargos Trabalhistas',
      descricao: 'Total de encargos (INSS empresa, FGTS, etc)',
      icon: '📈'
    },
  ]

  const handleGerarRelatorio = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/rh/relatorios?tipo=${tipoRelatorio}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `relatorio-${tipoRelatorio}-${new Date().getTime()}.csv`
        a.click()
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Relatórios RH</h1>
        <Link href="/admin/rh" className="text-blue-400 hover:text-blue-300">
          ← Voltar
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatorios.map(relatorio => (
          <button
            key={relatorio.id}
            className={`p-4 border rounded-lg text-left transition ${
              tipoRelatorio === relatorio.id
                ? 'bg-blue-500/20 border-blue-400'
                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl mb-2">{relatorio.icon}</div>
            <h3 className="font-semibold mb-1">{relatorio.nome}</h3>
            <p className="text-sm text-slate-400">{relatorio.descricao}</p>
          </button>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Período (Mês/Ano)</label>
          <input
            type="month"
            defaultValue={new Date().toISOString().slice(0, 7)}
            className="w-full max-w-xs px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
          />
        </div>

        <button
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-medium"
        >
          {loading ? 'Gerando...' : '⬇️ Gerar Relatório (CSV)'}
        </button>
      </div>

      <div className="bg-amber-500/20 border border-amber-400 text-amber-300 px-6 py-4 rounded-lg">
        <p className="text-sm">
          <strong>Nota:</strong> Os relatórios são exportados em formato CSV para fácil importação em Excel ou outros programas.
        </p>
      </div>
    </div>
  )
}
