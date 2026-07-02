'use client'

import { useState } from 'react'
import { Download, Filter } from 'lucide-react'

interface ReportOption {
  id: string
  label: string
  description: string
}

const REPORT_OPTIONS: ReportOption[] = [
  {
    id: 'folha-completa',
    label: 'Folha de Pagamento Completa',
    description: 'Relatório detalhado de todos os funcionários do mês',
  },
  {
    id: 'resumo-folha',
    label: 'Resumo da Folha',
    description: 'Valores totais de proventos, descontos e líquido',
  },
  {
    id: 'impostos',
    label: 'Resumo de Impostos',
    description: 'INSS, IRPF, FGTS e demais descontos',
  },
  {
    id: 'banco-horas',
    label: 'Banco de Horas',
    description: 'Saldo de horas extras e faltas de cada funcionário',
  },
  {
    id: 'eventos-folha',
    label: 'Eventos de Folha',
    description: 'Horas extras, adiantamentos, faltas registradas',
  },
  {
    id: 'historico-salarial',
    label: 'Histórico Salarial',
    description: 'Alterações de salário dos funcionários',
  },
]

export function RhReports() {
  const [selectedReport, setSelectedReport] = useState('folha-completa')
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [ano, setAno] = useState(new Date().getFullYear())
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      // Simular geração de relatório
      const response = await fetch(`/api/rh/relatorios?tipo=${selectedReport}&mes=${mes}&ano=${ano}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `relatorio-${selectedReport}-${mes}-${ano}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Relatório
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              {REPORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mês
            </label>
            <select
              value={mes}
              onChange={(e) => setMes(parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ano
            </label>
            <select
              value={ano}
              onChange={(e) => setAno(parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              {Array.from({ length: 5 }, (_, i) => ano - 2 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Descrição do Relatório */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          {REPORT_OPTIONS.find((r) => r.id === selectedReport)?.description}
        </p>
      </div>

      {/* Botão de Geração */}
      <button
        onClick={handleGenerateReport}
        disabled={isGenerating}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
      >
        <Download className="w-5 h-5" />
        {isGenerating ? 'Gerando relatório...' : 'Gerar Relatório em PDF'}
      </button>

      {/* Lista de Relatórios Disponíveis */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Relatórios Disponíveis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORT_OPTIONS.map((option) => (
            <div
              key={option.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                selectedReport === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              onClick={() => setSelectedReport(option.id)}
            >
              <h4 className="font-semibold text-slate-900">{option.label}</h4>
              <p className="text-sm text-slate-600 mt-1">{option.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
