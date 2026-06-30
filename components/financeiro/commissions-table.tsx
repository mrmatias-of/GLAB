'use client'

import React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface Commission {
  id: string
  tecnico: string
  periodo: string
  ordensCompletas: number
  valorTotal: number
  percentual: number
  comissao: number
  status: 'pendente' | 'pago'
  dataPagamento?: Date
}

interface CommissionsTableProps {
  commissions: Commission[]
  onPayAll?: () => void
}

export function CommissionsTable({ commissions, onPayAll }: CommissionsTableProps) {
  const totalComissoes = commissions.reduce((sum, c) => sum + c.comissao, 0)
  const pendentes = commissions.filter((c) => c.status === 'pendente').length

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Comissões de Técnicos</h3>
          <p className="text-sm text-gray-600 mt-1">
            {pendentes} comissões pendentes - Total: R${' '}
            {totalComissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        {pendentes > 0 && (
          <button
            onClick={onPayAll}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors text-sm"
          >
            Pagar Todos
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Técnico
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Período
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                Ordens
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Valor Total
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                Percentual
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Comissão
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((commission) => (
              <tr key={commission.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{commission.tecnico}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{commission.periodo}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-900">
                  {commission.ordensCompletas}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  R$ {commission.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">
                  {commission.percentual}%
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                  R$ {commission.comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      commission.status === 'pago'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {commission.status === 'pago' ? 'Pago' : 'Pendente'}
                  </span>
                  {commission.dataPagamento && (
                    <p className="text-xs text-gray-500 mt-1">
                      {format(commission.dataPagamento, 'dd/MM/yyyy')}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {commissions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Nenhuma comissão registrada</p>
        </div>
      )}
    </div>
  )
}
