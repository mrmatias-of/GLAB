'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/shared/data-table'
import { Modal } from '@/components/shared/modal'
import { Form, type FormField } from '@/components/shared/form'
import { StatusBadge } from '@/components/shared/badges'

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
  cpf_cnpj: string
  cidade: string
  estado: string
  ativo: boolean
  valor_acumulado: string
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      const res = await fetch('/api/clientes')
      if (!res.ok) throw new Error('Falha ao carregar clientes')
      const data = await res.json()
      setClientes(data)
    } catch (error) {
      console.error('[v0] fetchClientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({})
    setIsModalOpen(true)
  }

  const handleEdit = (cliente: Cliente) => {
    setEditingId(cliente.id)
    setFormData(cliente)
    setIsModalOpen(true)
  }

  const handleDelete = async (cliente: Cliente) => {
    if (!confirm('Tem certeza que deseja deletar este cliente?')) return
    try {
      const res = await fetch(`/api/clientes/${cliente.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao deletar cliente')
      setClientes((prev) => prev.filter((c) => c.id !== cliente.id))
    } catch (error) {
      console.error('[v0] handleDelete:', error)
      alert('Erro ao deletar cliente')
    }
  }

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/clientes/${editingId}` : '/api/clientes'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error('Falha ao salvar cliente')
      const data = await res.json()

      if (editingId) {
        setClientes((prev) => prev.map((c) => (c.id === editingId ? data : c)))
      } else {
        setClientes((prev) => [...prev, data])
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error('[v0] handleSubmit:', error)
      alert('Erro ao salvar cliente')
    }
  }

  const formFields: FormField[] = [
    { name: 'nome', label: 'Nome', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'telefone', label: 'Telefone', type: 'tel' },
    { name: 'cpf_cnpj', label: 'CPF/CNPJ' },
    { name: 'endereco', label: 'Endereço' },
    { name: 'cidade', label: 'Cidade' },
    { name: 'estado', label: 'Estado' },
    { name: 'cep', label: 'CEP' },
    { name: 'observacoes', label: 'Observações', type: 'textarea', rows: 3 },
  ]

  const columns = [
    { key: 'nome' as const, label: 'Nome', sortable: true },
    { key: 'email' as const, label: 'Email' },
    { key: 'telefone' as const, label: 'Telefone' },
    { key: 'cidade' as const, label: 'Cidade' },
    {
      key: 'ativo' as const,
      label: 'Status',
      render: (value: boolean) => <StatusBadge status={value ? 'ativo' : 'inativo'} />,
    },
    {
      key: 'valor_acumulado' as const,
      label: 'Valor Acumulado',
      render: (value: string) => `R$ ${Number(value).toFixed(2)}`,
    },
  ]

  return (
    <div className="space-y-4">
      <DataTable<Cliente>
        title="Gerenciamento de Clientes"
        columns={columns}
        data={clientes}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Pesquisar por nome, email..."
        searchableFields={['nome', 'email', 'telefone']}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Cliente' : 'Novo Cliente'}
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
          submitText={editingId ? 'Atualizar' : 'Criar'}
        />
      </Modal>
    </div>
  )
}
