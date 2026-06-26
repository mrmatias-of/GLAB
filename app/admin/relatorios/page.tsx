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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Relatórios</h1>
        <p className="text-slate-600">Gere relatórios personalizados de ordens, financeiro e estoque</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Ordens Finalizadas" value="145" change="+12%" trend="up" />
        <StatCard title="Receita Total" value="R$ 28,500" change="+8%" trend="up" />
        <StatCard title="Despesas" value="R$ 8,200" change="+3%" trend="up" />
        <StatCard title="Lucro Líquido" value="R$ 20,300" change="+15%" trend="up" />
      </div>

      {/* Report Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Configurar Relatório</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Relatório</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="ordens">Ordens de Serviço</option>
              <option value="financeiro">Financeiro</option>
              <option value="estoque">Estoque</option>
              <option value="tecnicos">Performance de Técnicos</option>
              <option value="clientes">Clientes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Período</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition"
            >
              {loading ? 'Gerando...' : 'Gerar Relatório'}
            </button>
          </div>
        </div>

        {/* Export Options */}
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition font-medium"
          >
            📄 Exportar PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition font-medium"
          >
            📊 Exportar Excel
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition font-medium"
          >
            🖨️ Imprimir
          </button>
        </div>
      </div>

      {/* Report Results */}
      {data.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Resultados do Relatório</h2>
            <p className="text-sm text-slate-600">{data.length} registros encontrados</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">Descrição</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">Valor</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">Data</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row: any, index: number) => (
                  <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-sm text-slate-900">{row.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.descricao}</td>
                    <td className={`px-6 py-4 text-sm font-medium ${
                      row.valor > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      R$ {Math.abs(row.valor).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(row.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        row.status === 'finalizado' ? 'bg-green-100 text-green-700' :
                        row.status === 'em_progresso' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
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
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-12 text-center">
          <p className="text-slate-600 mb-4">Nenhum relatório gerado ainda</p>
          <p className="text-sm text-slate-500">Configure os filtros acima e clique em "Gerar Relatório"</p>
        </div>
      )}
    </div>
  )
}
