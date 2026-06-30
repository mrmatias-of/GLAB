'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { AccountsTable, Account } from '@/components/financeiro/accounts-table'
import { CashFlowChart } from '@/components/financeiro/cash-flow-chart'
import { CommissionsTable, Commission } from '@/components/financeiro/commissions-table'

// Mock data
const mockAccountsPagar: Account[] = [
  {
    id: '1',
    numero: '#CP-2024-001',
    descricao: 'Fornecedor de Peças Eletrônicas',
    tipo: 'pagar',
    valor: 2500.0,
    dataVencimento: new Date(2024, 6, 15),
    status: 'pendente',
    beneficiario: 'Eletrônicos Brasil Ltda',
    categoria: 'Compra de Estoque',
  },
  {
    id: '2',
    numero: '#CP-2024-002',
    descricao: 'Aluguel do Escritório',
    tipo: 'pagar',
    valor: 3000.0,
    dataVencimento: new Date(2024, 6, 5),
    status: 'atrasado',
    beneficiario: 'Prédios Brasil',
    categoria: 'Imóvel',
  },
]

const mockAccountsReceber: Account[] = [
  {
    id: '3',
    numero: '#CR-2024-001',
    descricao: 'Manutenção Ar Condicionado - João Silva',
    tipo: 'receber',
    valor: 500.0,
    dataVencimento: new Date(2024, 6, 10),
    dataPagamento: new Date(2024, 6, 12),
    status: 'pago',
    beneficiario: 'João Silva',
    categoria: 'Serviço de Manutenção',
  },
  {
    id: '4',
    numero: '#CR-2024-002',
    descricao: 'Instalação Ar Condicionado - Maria Santos',
    tipo: 'receber',
    valor: 1200.0,
    dataVencimento: new Date(2024, 6, 20),
    status: 'pendente',
    beneficiario: 'Maria Santos',
    categoria: 'Serviço de Instalação',
  },
]

const mockCashFlowData = [
  { mes: 'Janeiro', entrada: 25000, saida: 18000, saldo: 7000 },
  { mes: 'Fevereiro', entrada: 28000, saida: 19000, saldo: 9000 },
  { mes: 'Março', entrada: 32000, saida: 21000, saldo: 11000 },
  { mes: 'Abril', entrada: 35000, saida: 22000, saldo: 13000 },
  { mes: 'Maio', entrada: 38000, saida: 24000, saldo: 14000 },
  { mes: 'Junho', entrada: 42000, saida: 26000, saldo: 16000 },
]

const mockCommissions: Commission[] = [
  {
    id: '1',
    tecnico: 'Pedro Santos',
    periodo: 'Junho/2024',
    ordensCompletas: 28,
    valorTotal: 8500.0,
    percentual: 15,
    comissao: 1275.0,
    status: 'pendente',
  },
  {
    id: '2',
    tecnico: 'João Silva',
    periodo: 'Junho/2024',
    ordensCompletas: 35,
    valorTotal: 10200.0,
    percentual: 15,
    comissao: 1530.0,
    status: 'pendente',
  },
  {
    id: '3',
    tecnico: 'Maria Oliveira',
    periodo: 'Junho/2024',
    ordensCompletas: 22,
    valorTotal: 6800.0,
    percentual: 15,
    comissao: 1020.0,
    status: 'pago',
    dataPagamento: new Date(2024, 7, 5),
  },
]

interface FinanceiroKPI {
  label: string
  value: string
  change: number
  trend: 'up' | 'down'
}

export default function FinanceiroAvancadoPage() {
  const [accountsPagar, setAccountsPagar] = useState(mockAccountsPagar)
  const [accountsReceber, setAccountsReceber] = useState(mockAccountsReceber)

  const totalReceber = accountsReceber.reduce((sum, a) => sum + a.valor, 0)
  const totalPagar = accountsPagar.reduce((sum, a) => sum + a.valor, 0)
  const saldoMes = mockCashFlowData[mockCashFlowData.length - 1].saldo
  const totalComissoes = mockCommissions.reduce((sum, c) => sum + c.comissao, 0)

  const kpis: FinanceiroKPI[] = [
    {
      label: 'Total a Receber',
      value: `R$ ${totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: 5.2,
      trend: 'up',
    },
    {
      label: 'Total a Pagar',
      value: `R$ ${totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: 2.1,
      trend: 'down',
    },
    {
      label: 'Saldo Mês',
      value: `R$ ${saldoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: 8.3,
      trend: 'up',
    },
    {
      label: 'Comissões Pendentes',
      value: `R$ ${totalComissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: 3.1,
      trend: 'up',
    },
  ]

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financeiro Avançado</h1>
          <p className="text-gray-600 mt-2">
            Gestão completa de contas a pagar/receber e fluxo de caixa
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <p className="text-gray-600 text-sm font-medium">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
              <p
                className={`text-sm font-medium mt-2 ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {kpi.trend === 'up' ? '↑' : '↓'} {kpi.change}%
              </p>
            </div>
          ))}
        </div>

        {/* Cash Flow */}
        <div className="mb-8">
          <CashFlowChart data={mockCashFlowData} />
        </div>

        {/* Accounts Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col">
            <AccountsTable
              accounts={accountsPagar}
              type="pagar"
              onDelete={(id) => setAccountsPagar((prev) => prev.filter((a) => a.id !== id))}
            />
          </div>
          <div className="flex flex-col">
            <AccountsTable
              accounts={accountsReceber}
              type="receber"
              onDelete={(id) =>
                setAccountsReceber((prev) => prev.filter((a) => a.id !== id))
              }
            />
          </div>
        </div>

        {/* Commissions */}
        <div className="mb-8">
          <CommissionsTable commissions={mockCommissions} />
        </div>

        {/* DRE Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Demonstração de Resultado do Exercício (DRE) - Junho 2024
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <p className="text-gray-700">Receita Total</p>
              <p className="font-semibold text-gray-900">R$ 42.000,00</p>
            </div>

            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">(-) Custo de Vendas</p>
                <p className="text-gray-900">R$ 16.800,00</p>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <p className="text-gray-600">(-) Despesas Operacionais</p>
                <p className="text-gray-900">R$ 9.200,00</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900">Lucro Operacional</p>
              <p className="font-bold text-blue-600">R$ 16.000,00</p>
            </div>

            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">(-) Comissões</p>
                <p className="text-gray-900">
                  R${' '}
                  {totalComissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <p className="text-gray-600">(-) Outras Despesas</p>
                <p className="text-gray-900">R$ 2.000,00</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
              <p className="font-bold text-gray-900">Lucro Líquido</p>
              <p className="font-bold text-green-600">R$ 12.825,00</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
