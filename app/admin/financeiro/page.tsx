'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/shared/data-table'
import { Modal } from '@/components/shared/modal'
import { Form, type FormField } from '@/components/shared/form'
import { StatusBadge } from '@/components/shared/badges'

interface Financeiro {
  id: number
  descricao: string
  tipo: string
  valor: string
  status: string
  data_vencimento: string | null
  data_pagamento: string | null
  categoria: string
}

export default function FinanceiroPage() {
  const [financeiro, setFinanceiro] = useState<Financeiro[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [filterType, setFilterType] = useState<'all' | 'receita' | 'despesa' | 'comissao'>('all')
  const [stats, setStats] = useState({
    receita: 0,
    despesa: 0,
    comissao: 0,
  })

  useEffect(() => {
    fetchFinanceiro()
  }, [filterType])

  const fetchFinanceiro = async () => {
    try {
      const url = filterType === 'all' ? '/api/financeiro' : `/api/financeiro?tipo=${filterType}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Falha ao carregar dados financeiros')
      const data = await res.json()
      setFinanceiro(data)

      // Calculate totals
      const allData = await fetch('/api/financeiro').then((r) => r.json())
      const receita = allData.filter((f: any) => f.tipo === 'receita').reduce((sum: number, f: any) => sum + Number(f.valor), 0)
      const despesa = allData.filter((f: any) => f.tipo === 'despesa').reduce((sum: number, f: any) => sum + Number(f.valor), 0)
      const comissao = allData.filter((f: any) => f.tipo === 'comissao').reduce((sum: number, f: any) => sum + Number(f.valor), 0)
      setStats({ receita, despesa, comissao })
    } catch (error) {
      console.error('[v0] fetchFinanceiro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({})
    setIsModalOpen(true)
  }

  const handleEdit = (item: Financeiro) => {
    setEditingId(item.id)
    setFormData(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (item: Financeiro) => {
    if (!confirm('Tem certeza que deseja deletar este item?')) return
    try {
      const res = await fetch(`/api/financeiro/${item.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao deletar item')
      setFinanceiro((prev) => prev.filter((f) => f.id !== item.id))
    } catch (error) {
      console.error('[v0] handleDelete:', error)
      alert('Erro ao deletar item')
    }
  }

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/financeiro/${editingId}` : '/api/financeiro'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error('Falha ao salvar item')
      const data = await res.json()

      if (editingId) {
        setFinanceiro((prev) => prev.map((f) => (f.id === editingId ? data : f)))
      } else {
        setFinanceiro((prev) => [...prev, data])
      }

      setIsModalOpen(false)
      fetchFinanceiro()
    } catch (error) {
      console.error('[v0] handleSubmit:', error)
      alert('Erro ao salvar item')
    }
  }

  const formFields: FormField[] = [
    { name: 'descricao', label: 'Descrição', required: true },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      required: true,
      options: [
        { label: 'Receita', value: 'receita' },
        { label: 'Despesa', value: 'despesa' },
        { label: 'Comissão', value: 'comissao' },
      ],
    },
    { name: 'valor', label: 'Valor (R$)', type: 'number', required: true, min: 0 },
    { name: 'categoria', label: 'Categoria' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Pendente', value: 'pendente' },
        { label: 'Pago', value: 'pago' },
        { label: 'Atrasado', value: 'atrasado' },
      ],
    },
    { name: 'data_vencimento', label: 'Data de Vencimento', type: 'date' },
    {
      name: 'forma_pagamento',
      label: 'Forma de Pagamento',
      type: 'select',
      options: [
        { label: 'Dinheiro', value: 'dinheiro' },
        { label: 'Débito', value: 'debito' },
        { label: 'Crédito', value: 'credito' },
        { label: 'Transferência', value: 'transferencia' },
        { label: 'Boleto', value: 'boleto' },
      ],
    },
    { name: 'observacoes', label: 'Observações', type: 'textarea', rows: 2 },
  ]

  const columns = [
    { key: 'descricao' as const, label: 'Descrição', sortable: true },
    {
      key: 'tipo' as const,
      label: 'Tipo',
      render: (value: string) => {
        const colors: Record<string, string> = {
          receita: 'bg-green-50 text-green-700 border-green-200',
          despesa: 'bg-red-50 text-red-700 border-red-200',
          comissao: 'bg-blue-50 text-blue-700 border-blue-200',
        }
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors[value] || ''}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        )
      },
    },
    {
      key: 'valor' as const,
      label: 'Valor',
      render: (value: string, row: Financeiro) => {
        const sign = row.tipo === 'despesa' ? '-' : '+'
        const color = row.tipo === 'despesa' ? 'text-red-600' : 'text-green-600'
        return <span className={`font-bold ${color}`}>{sign} R$ {Number(value).toFixed(2)}</span>
      },
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />,
    },
    { key: 'data_vencimento' as const, label: 'Vencimento' },
  ]

  const lucro = stats.receita - stats.despesa - stats.comissao

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Receitas</p>
          <p className="text-2xl font-bold text-green-700">R$ {stats.receita.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Despesas</p>
          <p className="text-2xl font-bold text-red-700">R$ {stats.despesa.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Comissões</p>
          <p className="text-2xl font-bold text-blue-700">R$ {stats.comissao.toFixed(2)}</p>
        </div>
        <div className={`p-4 rounded-lg border-2 ${lucro >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
          <p className={`text-sm font-medium ${lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>Lucro Líquido</p>
          <p className={`text-2xl font-bold ${lucro >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            R$ {lucro.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'receita', 'despesa', 'comissao'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type as any)}
            className={`px-4 py-2 rounded-lg border transition ${
              filterType === type
                ? 'bg-cyan-600 text-white border-cyan-600'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {type === 'all' ? 'Todos' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <DataTable<Financeiro>
        title="Gerenciamento Financeiro"
        columns={columns}
        data={financeiro}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Pesquisar por descrição..."
        searchableFields={['descricao', 'categoria']}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Lançamento' : 'Novo Lançamento'}
        onSubmit={() => handleSubmit(formData)}
      >
        <Form
          fields={formFields}
          initialValues={formData}
          onSubmit={async (values) => {
            setFormData(values)
            await handleSubmit(values)
          }}
          onCancel={() => setIsModalOpen(false)}
          submitText={editingId ? 'Atualizar' : 'Adicionar'}
        />
      </Modal>
    </div>
  )
}
