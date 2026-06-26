'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/shared/data-table'
import { Modal } from '@/components/shared/modal'
import { Form, type FormField } from '@/components/shared/form'
import { StatusBadge, RatingBadge } from '@/components/shared/badges'

interface Tecnico {
  id: number
  nome: string
  email: string
  telefone: string
  especialidade: string
  status: string
  comissao_percentual: string
  os_concluidas: number
  rating: string | null
}

export default function TecnicosPage() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchTecnicos()
  }, [])

  const fetchTecnicos = async () => {
    try {
      const res = await fetch('/api/tecnicos')
      if (!res.ok) throw new Error('Falha ao carregar técnicos')
      const data = await res.json()
      setTecnicos(data)
    } catch (error) {
      console.error('[v0] fetchTecnicos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({})
    setIsModalOpen(true)
  }

  const handleEdit = (tecnico: Tecnico) => {
    setEditingId(tecnico.id)
    setFormData(tecnico)
    setIsModalOpen(true)
  }

  const handleDelete = async (tecnico: Tecnico) => {
    if (!confirm('Tem certeza que deseja deletar este técnico?')) return
    try {
      const res = await fetch(`/api/tecnicos/${tecnico.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao deletar técnico')
      setTecnicos((prev) => prev.filter((t) => t.id !== tecnico.id))
    } catch (error) {
      console.error('[v0] handleDelete:', error)
      alert('Erro ao deletar técnico')
    }
  }

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/tecnicos/${editingId}` : '/api/tecnicos'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error('Falha ao salvar técnico')
      const data = await res.json()

      if (editingId) {
        setTecnicos((prev) => prev.map((t) => (t.id === editingId ? data : t)))
      } else {
        setTecnicos((prev) => [...prev, data])
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error('[v0] handleSubmit:', error)
      alert('Erro ao salvar técnico')
    }
  }

  const formFields: FormField[] = [
    { name: 'nome', label: 'Nome', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'telefone', label: 'Telefone', type: 'tel' },
    { name: 'cpf', label: 'CPF' },
    { name: 'especialidade', label: 'Especialidade', placeholder: 'Ex: Celular, Notebook' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Ativo', value: 'ativo' },
        { label: 'Inativo', value: 'inativo' },
        { label: 'Férias', value: 'ferias' },
      ],
    },
    {
      name: 'comissao_percentual',
      label: 'Comissão (%)',
      type: 'number',
      min: 0,
      max: 100,
    },
  ]

  const columns = [
    { key: 'nome' as const, label: 'Nome', sortable: true },
    { key: 'email' as const, label: 'Email' },
    { key: 'telefone' as const, label: 'Telefone' },
    { key: 'especialidade' as const, label: 'Especialidade' },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />,
    },
    { key: 'os_concluidas' as const, label: 'OS Concluídas' },
    {
      key: 'rating' as const,
      label: 'Rating',
      render: (value: string | null) => <RatingBadge rating={value ? Number(value) : null} />,
    },
  ]

  return (
    <div className="space-y-6">
      <DataTable<Tecnico>
        title="Gerenciamento de Técnicos"
        columns={columns}
        data={tecnicos}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Pesquisar por nome, email..."
        searchableFields={['nome', 'email', 'especialidade']}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Técnico' : 'Novo Técnico'}
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
