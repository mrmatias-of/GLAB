'use client'

import { useState } from 'react'
import { DataTable } from '@/components/shared/data-table'
import { StatCard } from '@/components/shared/stat-card'

export default function RelatoriosPage() {
  const [reportType, setReportType] = useState('ordens')
  const [period, setPeriod] = useState('mes')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const handleGenerateReport = async () => {
    setLoading(true)
    try {
      // Simulação de geração de relatório
      const mockData = [
        { id: 1, descricao: 'OS #001 - Reparo Celular', valor: 150.00, data: '2024-01-15', status: 'finalizado' },
        { id: 2, descricao: 'OS #002 - Reparo Notebook', valor: 300.00, data: '2024-01-16', status: 'finalizado' },
        { id: 3, descricao: 'OS #003 - Limpeza PC', valor: 80.00, data: '2024-01-17', status: 'em_progresso' },
        { id: 4, descricao: 'Comissão Técnico João', valor: 50.00, data: '2024-01-15', tipo: 'comissao' },
        { id: 5, descricao: 'Peças - Tela iPhone', valor: -200.00, data: '2024-01-16', tipo: 'despesa' },
      ]
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = () => {
    alert('Exportação para PDF - em desenvolvimento')
  }

  const handleExportExcel = () => {
    alert('Exportação para Excel - em desenvolvimento')
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Relatórios</h1>
        <p className="text-slate-400 text-sm">Gere relatórios personalizados de ordens, financeiro e estoque</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <StatCard title="Ordens Finalizadas" value="145" trend={12} trendLabel="vs mês anterior" color="blue" />
        <StatCard title="Receita Total" value="R$ 28,5K" trend={8} trendLabel="vs mês anterior" color="green" />
        <StatCard title="Despesas" value="R$ 8,2K" trend={3} trendLabel="vs mês anterior" color="red" />
        <StatCard title="Lucro Líquido" value="R$ 20,3K" trend={15} trendLabel="vs mês anterior" color="blue" />
      </div>

      {/* Report Configuration */}
      <div className="card-elegant bg-slate-900/40">
        <h2 className="text-lg font-bold text-white mb-3">Configurar Relatório</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wide">Tipo de Relatório</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="ordens">Ordens de Serviço</option>
              <option value="financeiro">Financeiro</option>
              <option value="estoque">Estoque</option>
              <option value="tecnicos">Performance de Técnicos</option>
              <option value="clientes">Clientes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wide">Período</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="dia">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
              <option value="trimestre">Este Trimestre</option>
              <option value="ano">Este Ano</option>
              <option value="customizado">Personalizado</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-2 rounded-lg transition text-sm"
            >
              {loading ? 'Gerando...' : 'Gerar Relatório'}
            </button>
          </div>
        </div>

        {/* Export Options */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition font-medium text-sm border border-red-500/30"
          >
            Exportar PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition font-medium text-sm border border-green-500/30"
          >
            Exportar Excel
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition font-medium text-sm border border-blue-500/30"
          >
            Imprimir
          </button>
        </div>
      </div>

      {/* Report Results */}
      {data.length > 0 && (
        <div className="card-elegant bg-slate-900/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <h2 className="text-base font-bold text-white">Resultados do Relatório</h2>
            <p className="text-xs text-slate-400 mt-0.5">{data.length} registros encontrados</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">Descrição</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">Valor</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">Data</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row: any, index: number) => (
                  <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition">
                    <td className="px-4 py-2 text-slate-300">{row.id}</td>
                    <td className="px-4 py-2 text-slate-300">{row.descricao}</td>
                    <td className={`px-4 py-2 font-medium ${
                      row.valor > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      R$ {Math.abs(row.valor).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-slate-400">
                      {new Date(row.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.status === 'finalizado' ? 'bg-green-500/20 text-green-400' :
                        row.status === 'em_progresso' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-700/50 text-slate-300'
                      }`}>
                        {row.status === 'finalizado' ? 'Finalizado' :
                         row.status === 'em_progresso' ? 'Em Progresso' :
                         row.tipo || 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <div className="card-elegant bg-slate-900/40 p-6 text-center">
          <p className="text-slate-400 mb-2">Nenhum relatório gerado ainda</p>
          <p className="text-sm text-slate-500">Configure os filtros acima e clique em "Gerar Relatório"</p>
        </div>
      )}
    </div>
  )
}
