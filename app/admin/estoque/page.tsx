'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/shared/data-table'
import { Modal } from '@/components/shared/modal'
import { Form, type FormField } from '@/components/shared/form'
import { AlertCircle } from 'lucide-react'

interface Estoque {
  id: number
  nome: string
  categoria: string
  quantidade_atual: string
  quantidade_minima: string
  valor_unitario: string
  localizacao: string
  garantia_meses: number | null
}

export default function EstoquePage() {
  const [estoque, setEstoque] = useState<Estoque[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [showAlertas, setShowAlertas] = useState(false)

  useEffect(() => {
    fetchEstoque()
  }, [showAlertas])

  const fetchEstoque = async () => {
    try {
      const url = showAlertas ? '/api/estoque?alertas=true' : '/api/estoque'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Falha ao carregar estoque')
      const data = await res.json()
      setEstoque(data)
    } catch (error) {
      console.error('[v0] fetchEstoque:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({})
    setIsModalOpen(true)
  }

  const handleEdit = (item: Estoque) => {
    setEditingId(item.id)
    setFormData(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (item: Estoque) => {
    if (!confirm('Tem certeza que deseja deletar este item?')) return
    try {
      const res = await fetch(`/api/estoque/${item.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao deletar item')
      setEstoque((prev) => prev.filter((e) => e.id !== item.id))
    } catch (error) {
      console.error('[v0] handleDelete:', error)
      alert('Erro ao deletar item')
    }
  }

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/estoque/${editingId}` : '/api/estoque'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error('Falha ao salvar item')
      const data = await res.json()

      if (editingId) {
        setEstoque((prev) => prev.map((e) => (e.id === editingId ? data : e)))
      } else {
        setEstoque((prev) => [...prev, data])
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error('[v0] handleSubmit:', error)
      alert('Erro ao salvar item')
    }
  }

  const formFields: FormField[] = [
    { name: 'nome', label: 'Nome da Peça', required: true },
    { name: 'descricao', label: 'Descrição', type: 'textarea', rows: 2 },
    { name: 'categoria', label: 'Categoria', placeholder: 'Ex: Peças, Acessórios' },
    { name: 'quantidade_atual', label: 'Quantidade Atual', type: 'number', required: true, min: 0 },
    { name: 'quantidade_minima', label: 'Quantidade Mínima', type: 'number', min: 0 },
    { name: 'valor_unitario', label: 'Valor Unitário (R$)', type: 'number', required: true, min: 0 },
    { name: 'localizacao', label: 'Localização', placeholder: 'Ex: Prateleira A1' },
    { name: 'garantia_meses', label: 'Garantia (meses)', type: 'number', min: 0 },
  ]

  const alertas = estoque.filter(
    (e) => Number(e.quantidade_atual) < Number(e.quantidade_minima)
  )

  const columns = [
    { key: 'nome' as const, label: 'Nome', sortable: true },
    { key: 'categoria' as const, label: 'Categoria' },
    {
      key: 'quantidade_atual' as const,
      label: 'Quantidade',
      render: (value: string, row: Estoque) => {
        const isLow = Number(value) < Number(row.quantidade_minima)
        return (
          <div className={isLow ? 'text-red-600 font-bold' : ''}>
            {value} {isLow && <span className="ml-2">⚠️</span>}
          </div>
        )
      },
    },
    { key: 'quantidade_minima' as const, label: 'Mínimo' },
    {
      key: 'valor_unitario' as const,
      label: 'Valor Unitário',
      render: (value: string) => `R$ ${Number(value).toFixed(2)}`,
    },
    { key: 'localizacao' as const, label: 'Localização' },
  ]

  return (
    <div className="space-y-4">
      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-900">{alertas.length} itens com estoque baixo</h3>
            <p className="text-red-700 text-sm">Quantidade abaixo do mínimo configurado</p>
          </div>
          <button
            onClick={() => setShowAlertas(!showAlertas)}
            className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            {showAlertas ? 'Ver Tudo' : 'Ver Alertas'}
          </button>
        </div>
      )}

      <DataTable<Estoque>
        title={showAlertas ? 'Itens com Estoque Baixo' : 'Gerenciamento de Estoque'}
        columns={columns}
        data={estoque}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Pesquisar por nome, categoria..."
        searchableFields={['nome', 'categoria', 'localizacao']}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Item' : 'Novo Item'}
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
