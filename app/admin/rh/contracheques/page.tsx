'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Contracheque {
  id: number
  funcionario_id: number
  mes: number
  ano: number
  valor_liquido: string
  status_pagamento: string
  data_geracao: string
}

export default function ContrachequeListPage() {
  const [contracheques, setContracheques] = useState<Contracheque[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContracheques = async () => {
      try {
        const response = await fetch('/api/rh/contracheques')
        if (response.ok) {
          const data = await response.json()
          setContracheques(data.data || [])
        }
      } catch (error) {
        console.error('Erro ao buscar contracheques:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContracheques()
  }, [])

  const getMesAno = (mes: number, ano: number) => {
    const meses = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${meses[mes]}/${ano}`
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'pago':
        return 'bg-green-500/20 text-green-300'
      case 'pendente':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'processando':
        return 'bg-blue-500/20 text-blue-300'
      default:
        return 'bg-gray-500/20 text-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contracheques</h1>
        <Link href="/admin/rh/gerar-folha" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium">
          + Gerar Folha
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : contracheques.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-400">Nenhum contracheque gerado</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-slate-800/50 border border-slate-700 rounded-lg">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr className="text-left text-sm font-semibold text-slate-300">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Mês/Ano</th>
                <th className="px-6 py-3">Valor Líquido</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {contracheques.map(c => (
                <tr key={c.id} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4 text-sm">{c.id}</td>
                  <td className="px-6 py-4 text-sm font-medium">{getMesAno(c.mes, c.ano)}</td>
                  <td className="px-6 py-4 text-sm">R$ {parseFloat(c.valor_liquido).toFixed(2).replace('.', ',')}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${statusColor(c.status_pagamento)}`}>
                      {c.status_pagamento}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(c.data_geracao).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-sm">
                    <Link href={`/admin/rh/contracheques/${c.id}`} className="text-blue-400 hover:text-blue-300">
                      Visualizar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
