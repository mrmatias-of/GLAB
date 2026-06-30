'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronDown, Eye, Trash2, Edit2 } from 'lucide-react'

export interface Account {
  id: string
  numero: string
  descricao: string
  tipo: 'pagar' | 'receber'
  valor: number
  dataVencimento: Date
  dataPagamento?: Date
  status: 'pendente' | 'pago' | 'atrasado' | 'parcial'
  beneficiario: string
  categoria: string
}

interface AccountsTableProps {
  accounts: Account[]
  type: 'pagar' | 'receber'
  onEdit?: (account: Account) => void
  onDelete?: (id: string) => void
  onPayment?: (id: string) => void
}

const STATUS_COLORS: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  pago: 'bg-green-100 text-green-800',
  atrasado: 'bg-red-100 text-red-800',
  parcial: 'bg-blue-100 text-blue-800',
}

const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  pago: 'Pago',
  atrasado: 'Atrasado',
  parcial: 'Parcial',
}

export function AccountsTable({
  accounts,
  type,
  onEdit,
  onDelete,
  onPayment,
}: AccountsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const typeLabel = type === 'pagar' ? 'Contas a Pagar' : 'Contas a Receber'

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{typeLabel}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Beneficiário
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Vencimento
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <React.Fragment key={account.id}>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === account.id ? null : account.id)
                        }
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedId === account.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div>
                        <p className="font-medium text-gray-900">{account.descricao}</p>
                        <p className="text-sm text-gray-500">{account.numero}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{account.beneficiario}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      R$ {account.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500">{account.categoria}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {format(account.dataVencimento, 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_COLORS[account.status]
                      }`}
                    >
                      {STATUS_LABELS[account.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {account.status === 'pendente' && type === 'receber' && (
                        <button
                          onClick={() => onPayment?.(account.id)}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Marcar como recebido"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onEdit?.(account)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(account.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>

                {expandedId === account.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Data de Vencimento</p>
                          <p className="font-medium text-gray-900">
                            {format(account.dataVencimento, "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                        {account.dataPagamento && (
                          <div>
                            <p className="text-sm text-gray-600">Data de Pagamento</p>
                            <p className="font-medium text-gray-900">
                              {format(account.dataPagamento, "dd 'de' MMMM 'de' yyyy", {
                                locale: ptBR,
                              })}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-600">Categoria</p>
                          <p className="font-medium text-gray-900">{account.categoria}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Valor</p>
                          <p className="font-medium text-gray-900">
                            R$ {account.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Nenhuma conta encontrada</p>
        </div>
      )}
    </div>
  )
}
