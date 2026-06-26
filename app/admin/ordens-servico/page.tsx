'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/shared/data-table'
import { Modal } from '@/components/shared/modal'
import { Form, type FormField } from '@/components/shared/form'
import { StatusBadge, PriorityBadge } from '@/components/shared/badges'

interface OrdemServico {
  id: number
  numero: string
  cliente_id: number
  tecnico_id: number
  descricao: string
  status: string
  prioridade: string
  data_prevista: string
  data_conclusao: string | null
  valor_orcado: string
  valor_final: string | null
}

export default function OrdensServicoPage() {
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [clientes, setClientes] = useState<any[]>([])
  const [tecnicos, setTecnicos] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [osRes, clientesRes, tecnicosRes] = await Promise.all([
        fetch('/api/ordens-servico'),
        fetch('/api/clientes'),
        fetch('/api/tecnicos'),
      ])

      if (!osRes.ok || !clientesRes.ok || !tecnicosRes.ok) throw new Error('Falha ao carregar dados')

      const [osData, clientesData, tecnicosData] = await Promise.all([
        osRes.json(),
        clientesRes.json(),
        tecnicosRes.json(),
      ])

      setOrdensServico(osData)
      setClientes(clientesData)
      setTecnicos(tecnicosData)
    } catch (error) {
      console.error('[v0] fetchData:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({})
    setIsModalOpen(true)
  }

  const handleEdit = (os: OrdemServico) => {
    setEditingId(os.id)
    setFormData(os)
    setIsModalOpen(true)
  }

  const handleDelete = async (os: OrdemServico) => {
    if (!confirm('Tem certeza que deseja deletar esta OS?')) return
    try {
      const res = await fetch(`/api/ordens-servico/${os.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao deletar OS')
      setOrdensServico((prev) => prev.filter((o) => o.id !== os.id))
    } catch (error) {
      console.error('[v0] handleDelete:', error)
      alert('Erro ao deletar OS')
    }
  }

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/ordens-servico/${editingId}` : '/api/ordens-servico'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error('Falha ao salvar OS')
      const data = await res.json()

      if (editingId) {
        setOrdensServico((prev) => prev.map((o) => (o.id === editingId ? data : o)))
      } else {
        setOrdensServico((prev) => [...prev, data])
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error('[v0] handleSubmit:', error)
      alert('Erro ao salvar OS')
    }
  }

  const formFields: FormField[] = [
    {
      name: 'cliente_id',
      label: 'Cliente',
      type: 'select',
      required: true,
      options: clientes.map((c) => ({ label: c.nome, value: c.id })),
    },
    {
      name: 'tecnico_id',
      label: 'Técnico',
      type: 'select',
      required: true,
      options: tecnicos.map((t) => ({ label: t.nome, value: t.id })),
    },
    { name: 'descricao', label: 'Descrição', type: 'textarea', required: true, rows: 3 },
    { name: 'equipamento', label: 'Equipamento' },
    { name: 'numero_serie', label: 'Número de Série' },
    {
      name: 'prioridade',
      label: 'Prioridade',
      type: 'select',
      options: [
        { label: 'Alta', value: 'alta' },
        { label: 'Normal', value: 'normal' },
        { label: 'Baixa', value: 'baixa' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Aberto', value: 'aberto' },
        { label: 'Em Progresso', value: 'em_progresso' },
        { label: 'Pausado', value: 'pausado' },
        { label: 'Finalizado', value: 'finalizado' },
        { label: 'Cancelado', value: 'cancelado' },
      ],
    },
    { name: 'data_prevista', label: 'Data Prevista', type: 'date' },
    { name: 'tempo_estimado_horas', label: 'Tempo Estimado (horas)', type: 'number' },
    { name: 'valor_orcado', label: 'Valor Orçado', type: 'number', min: 0 },
    { name: 'observacoes', label: 'Observações', type: 'textarea', rows: 3 },
  ]

  const columns = [
    { key: 'numero' as const, label: 'Número', sortable: true },
    {
      key: 'prioridade' as const,
      label: 'Prioridade',
      render: (value: string) => <PriorityBadge priority={value} />,
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />,
    },
    { key: 'descricao' as const, label: 'Descrição' },
    { key: 'data_prevista' as const, label: 'Data Prevista', sortable: true },
    {
      key: 'valor_orcado' as const,
      label: 'Valor',
      render: (value: string) => `R$ ${Number(value).toFixed(2)}`,
    },
  ]

  return (
    <div className="space-y-6">
      <DataTable<OrdemServico>
        title="Gerenciamento de Ordens de Serviço"
        columns={columns}
        data={ordensServico}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Pesquisar por número, descrição..."
        searchableFields={['numero', 'descricao']}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
        size="lg"
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
